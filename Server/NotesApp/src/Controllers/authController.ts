import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {Request, Response} from "express";

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  console.log("** login", req.body);
  if (!userName || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  const userDetails = await User.findOne({ userName }).lean().exec();
  console.log("** userDetails", userDetails);
  if ( !userDetails || !userDetails.active) {
    console.log("** here");
    res.status(401).json({ message: "Unauthorized: Invalid username or account is inactive" });
    return;
  }

  const matchedPwd = await bcrypt.compare(password, userDetails.password);
  console.log("** matchedPwd", matchedPwd);
  if (!matchedPwd) {
    res.status(401).json({ message: "Unauthorized: Invalid username or password" });
    return;
  }

  const accessToken = jwt.sign(
    {
      "userInfo" : {
        "id": userDetails._id,
        "userName": userDetails.userName,
        "roles": userDetails.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET as string, // Ensure this is set in your .env file
    { expiresIn: '15m' }, // Token expiration time
  );

  const refreshToken = jwt.sign(
    {"userName": userDetails.userName},
    process.env.REFRESH_TOKEN_SECRET as string, // Ensure this is set in your .env file
    { expiresIn: '7d' } // Refresh token expiration time
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true,
    sameSite: "none", // required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access tocken might be expired
const refresh = asyncHandler(async (req: Request, res: Response) => {

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.status(401).json({ message: "Unauthorized: No refresh token found" });
    return;
  }

  const refreshToken = cookies.jwt;
  let decode: any;
  try {
    decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid refresh token" });
    return;
  }

  const userName = decode.userName;
  const userDetails = await User.findOne({ userName }).lean().exec();
  if (!userDetails || !userDetails.active) {
    res.status(403).json({ message: "Forbidden: User not found or User not active" });
    return;
  }

  const accessToken = jwt.sign(
    {
      "userInfo": {
        "id": userDetails._id,
        "userName": userDetails.userName,
        "roles": userDetails.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '15m' } // Token expiration time
  );

  res.json({ accessToken });
});


// @desc Logout
// @route GET /auth/logout
// @access Public - just to clear cookies if exists
const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // No cookie to clear
    res.sendStatus(204); // No content
    return;
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none", // required for cross-site cookies
    maxAge: 0 // immediately expire the cookie
  });
  res.json({ message: "cookies cleared"});
});

export const authController = {
  login,
  refresh,
  logout
};