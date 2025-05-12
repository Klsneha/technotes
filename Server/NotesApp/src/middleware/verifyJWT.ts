
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req: any, res: any, next: any) => {
  console.log("*** verifyJWT");
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized, token missing" });
  };

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: "Forbidden, invalid token" });
      return;
    }
    req.userName = decoded.userInfo.userName;
    req.roles =  decoded.userInfo.roles;// Attach user info to request object
    next();
  })
});