import User from "../models/User";
import { purchasePremium } from "../services/premiumService";

jest.mock("../models/User");

describe("PremiumService", () => {
  const mockUser = {
    _id: "userId",
    isPremium: false,
    isVerified: false,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully purchase a premium package", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await purchasePremium("userId");

    expect(result).toBe(
      "Premium package purchased successfully. You now have unlimited swipes and a verified label.",
    );
    expect(mockUser.isPremium).toBe(true);
    expect(mockUser.isVerified).toBe(true);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should throw an error if user is not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(purchasePremium("invalidUserId")).rejects.toThrow(
      "User not found",
    );
  });
});
