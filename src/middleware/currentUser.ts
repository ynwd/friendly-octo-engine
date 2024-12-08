import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

function convertUnknownToId(value: unknown) {
  return value as { id: string };
}

/**
 * Middleware to set req.user with authenticated user info
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
const setCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.url === "/api/auth/register" || req.url === "/api/auth/login") {
    return next();
  }

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Authorization token is required" });
    return;
  }

  try {
    const decoded = convertUnknownToId(
      jwt.verify(token, process.env.JWT_SECRET || "jwt_secret") as unknown,
    );
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export default setCurrentUser;
