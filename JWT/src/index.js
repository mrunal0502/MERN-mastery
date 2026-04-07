import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { fakeDB } from "./fakeDB.js";
import { hash, compare } from "bcrypt";
import createAccessAndRefreshToken from "./tokens.js";
import isAuth from "./isAuth.js";

dotenv.config();
const app = express();

//1. Regsiter a user
//2. login a user
//3. logout a user
//4. setup a protected route
//5. get new access token with refresh token

//express middleware
app.use(express.json()); // To parse incoming JSON requests and populate the req.body property with the parsed data.
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", //frontend url
    credentials: true, // Cookies Session IDs Authentication tokens (like login sessions) to be sent along with requests.
  }),
);

app.use(express.urlencoded({ extended: true })); //support URL-encoded bodies

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  return res.send("Hello World");
});

//1. Regsiter a user

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    //1. check if user already exists
    //2. hash the password
    //3. store the user in database
    const user = fakeDB.find((user) => user.email === username);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hash(password, 10);
    console.log(hashedPassword);
    fakeDB.push({
      id: fakeDB.length,
      email: username,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//2. Login a user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    //1. check if user exists
    //2. compare the password
    //3. generate access token and refresh token

    const user = fakeDB.find((user) => user.email === username);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = createAccessAndRefreshToken(user);

    //put the refresh token in the database
    user.refreshToken = refreshToken;

    console.log(fakeDB);

    // send the refresh token as a cookie
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({ message: "Login successful" });
  } catch (err) {
    console.log(err);
  }
});

//3. Logout a user
app.post("/logout", async (req, res) => {
  res
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json({ message: "Logout successful" });
});

//4. Protected route
app.get("/protected", async (req, res) => {
  try {
    const userId = isAuth(req);

    if (userId !== null) {
      return res
        .status(200)
        .json({ message: "You are authorized to access this route" });
    }
  } catch (err) {
    console.log(err);
  }
});

//5. get new access with refresh token
app.post("/refresh_token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  const isValid = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});
