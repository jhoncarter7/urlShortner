
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/Usermodel.js";

// const generateToken = (id, role) => {
//   const secret = process.env.JWT_SECRET || "fallbackSecretKey123!";
//   const expiresIn = process.env.JWT_EXPIRE || "30d";

//   if (!secret || secret === "fallbackSecretKey123!") {
//     console.warn(
//       "Warning: JWT_SECRET is not set or using fallback. Set it in your .env file!"
//     );
//   }

//   return jwt.sign({ id, role }, secret, { expiresIn });
// };

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body; 

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    user.password = undefined;
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: user.getSignedJwtToken(),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");
  const options = {
    httpsOnly: true,
    secure: true,
  };

  if (user && (await user.matchPassword(password))) {
    res
      .cookie("accessToken", user.getSignedJwtToken(), options)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: user.getSignedJwtToken(),
      });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getMe = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  console.log("Logout request received");
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json({ success: true, message: "Logged out successfully" });
});

export { registerUser, loginUser, getMe, logoutUser };
