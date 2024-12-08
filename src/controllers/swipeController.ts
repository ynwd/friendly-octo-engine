import { Request, Response } from "express";
import { swipeProfile } from "../services/swipeService";

/**
 * swipeProfile Controller
 *
 * @param req
 * @param res
 */
export const swipeProfileController = async (req: Request, res: Response) => {
  const { profileId, direction } = req.body;
  const userId = req.user?.id;

  try {
    const message = await swipeProfile(userId, profileId, direction);
    res.status(200).json({ message });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};
