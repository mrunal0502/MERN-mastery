import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

import jwt from "jsonwebtoken";

// const registerUser = asyncHandler(async (req, res) => {
//   console.log("ENTERED REGISTER USER CONTROLLER");
//   console.log("req.files:", req.files);
//   console.log("req.body:", req.body);
//   const { fullName, email, username, password } = req.body;

//   //validation
//   if (
//     [fullName, username, email, password].some((field) => field?.trim() === "")
//   ) {
//     throw new ApiError(400, "FullName is required");
//   }

//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });

//   if (existedUser) {
//     throw new ApiError(409, "User already exists");
//   }

//   console.warn(req.files);
//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   const coverImgLocalPath = req.files?.coverImage?.[0]?.path;

//   console.log("Avatar path:", avatarLocalPath);
//   console.log("File exists:", require("fs").existsSync(avatarLocalPath));
//   console.log("Full req.files:", JSON.stringify(req.files, null, 2));

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file is missing");
//   }
//   console.log("Avatar path:", avatarLocalPath);
//   console.log("File exists:", require("fs").existsSync(avatarLocalPath));

//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   let coverImage = "";
//   if (coverImgLocalPath) {
//     coverImage = await uploadOnCloudinary(coverImgLocalPath);
//   }

//   const user = await User.create({
//     fullName,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     email,
//     password,
//     username: username.toLowerCase(),
//   });

//   //just to get the user now from the database to ensure it is successfully stored in db
//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser)
//     throw new ApiError(500, "Something went wrong while registering the user");

//   return res
//     .status(201)
//     .json(new ApiResponse(201, createdUser, "User registered successfully"));
// });

const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("ENTERED REGISTER USER CONTROLLER");
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);
    const { fullName, email, username, password } = req.body;

    //validation
    if (
      [fullName, username, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All details are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User already exists");
    }

    console.warn(req.files);
    const avatarBuffer = req.files?.avatar?.[0]?.buffer;
    const coverImageBuffer = req.files?.coverImage?.[0]?.buffer;

    console.log("Avatar buffer size:", avatarBuffer?.length);
    console.log("Cover image buffer size:", coverImageBuffer?.length);

    if (!avatarBuffer) {
      throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarBuffer);
    let coverImage = "";
    if (coverImageBuffer) {
      coverImage = await uploadOnCloudinary(coverImageBuffer);
    }

    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser)
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (err) {
    console.log("User creation failed:", err);
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }

    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while registering a user and images were deleted"
    );
  }
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating both Tokens"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields required");
  }

  const user = User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  //validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong");
  }

  const options = {
    httpOnly: true, //makes cookie non modifiable from client slide only you can make changes
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User looged in successfully"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    const decodedtoken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token"
    );
  }
});

export { registerUser, loginUser, refreshAccessToken };
