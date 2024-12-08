import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, getUser } from "../services/userService";

/**
 * registerUser controller
 *
 * @param req
 * @param res
 */
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    await createUser(username, email, password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ message: "Failed to register user." });
  }
};

/**
 * loginUser controller
 *
 * @param req
 * @param res
 * @returns
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await getUser(email, password);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "jwt_secret",
      { expiresIn: "1h" },
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};
