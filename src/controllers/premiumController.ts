import { Request, Response } from "express";
import { purchasePremium } from "../services/premiumService";

export const purchasePremiumController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;

  try {
    const message = await purchasePremium(userId);
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};
