import User from "../models/User";
import { swipeProfile } from "./swipeService";

jest.mock("../models/User"); // Mock the User model

describe("swipeProfile", () => {
  const mockUser = {
    _id: "userId",
    swipeCount: 0,
    lastSwipeDate: null,
    swipedProfiles: [],
    save: jest.fn(),
  };

  const mockUserPremium = {
    _id: "premiumUserId",
    isPremium: true,
    swipeCount: 0,
    lastSwipeDate: null,
    swipedProfiles: [],
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow a premium user to swipe without limits", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUserPremium);

    const result = await swipeProfile("premiumUserId", "profileId123", "like");

    expect(result).toBe("You liked the profile!");
    expect(mockUserPremium.swipedProfiles).toContain("profileId123");
    expect(mockUserPremium.save).toHaveBeenCalled();
    expect(mockUserPremium.swipeCount).toBe(0); // make sure not counting
  });

  it("should successfully like a profile", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await swipeProfile("userId", "profileId", "like");

    expect(result).toBe("You liked the profile!");
    expect(mockUser.swipedProfiles).toContain("profileId");
    expect(mockUser.swipeCount).toBe(1);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should successfully pass on a profile", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      ...mockUser,
      swipedProfiles: [], // Ensure no profiles have been swiped yet
      swipeCount: 0, // Initial swipe count
      lastSwipeDate: new Date(), // Set to today
    });

    const result = await swipeProfile("userId", "profileId", "pass");

    expect(result).toBe("You passed on the profile.");
    expect(mockUser.swipedProfiles).toContain("profileId");
    expect(mockUser.swipeCount).toBe(1);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should throw an error if user is not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      swipeProfile("invalidUserId", "profileId", "like"),
    ).rejects.toThrow("User not found");
  });

  it("should throw an error if swipe limit is reached", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      ...mockUser,
      swipeCount: 10,
      lastSwipeDate: new Date(),
      swipedProfiles: [],
    });

    await expect(swipeProfile("userId", "profileId", "like")).rejects.toThrow(
      "Swipe limit reached for today",
    );
  });

  it("should throw an error if profile has already been swiped today", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      ...mockUser,
      swipedProfiles: ["profileId"],
      lastSwipeDate: new Date(),
      swipeCount: 0,
    });

    await expect(swipeProfile("userId", "profileId", "like")).rejects.toThrow(
      "Profile has already been swiped today",
    );
  });

  it("should reset swipe count if a new day", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Set lastSwipeDate to yesterday

    (User.findById as jest.Mock).mockResolvedValue({
      ...mockUser,
      lastSwipeDate: yesterday,
      swipeCount: 5, // Existing count
      swipedProfiles: [],
      save: jest.fn(),
    });

    await swipeProfile("userId", "newProfileId", "like");

    expect(mockUser.swipeCount).toBe(1);
  });
});
