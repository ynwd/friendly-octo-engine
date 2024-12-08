import User from "../models/User";

export async function purchasePremium(userId: string): Promise<string> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.isPremium = true;
  user.isVerified = true;
  await user.save();

  return "Premium package purchased successfully. You now have unlimited swipes and a verified label.";
}
