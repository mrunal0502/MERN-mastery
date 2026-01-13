import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String, //keeping the current file in local storage
      },
      default: {
        url: `https://placehold.co/200x200`,
        localPath: ``,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    reFreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      // to store the token generated during forgot password
      type: String,
    },
    forgotPasswordTokenExpiry: {
      // to store the expiry time of the token
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    },
  );
};

userSchema.methodsgenerateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = randomBytes(20).toString("hex");
  const hashedToken = createHash("sha256").update(unHashedToken).digest("hex");

  const tokenExpiry = new Date(Date.now() + 20 * 60 * 1000); //20 minutes from now

  return { hashedToken, unHashedToken, tokenExpiry };
};

export const User = mongoose.model("User", userSchema);
