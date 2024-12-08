import User from "../models/User";

/**
 * swipeProfile service
 *
 * @param userId
 * @param profileId
 * @param direction
 * @returns
 */
export async function swipeProfile(
  userId: string,
  profileId: string,
  direction: "like" | "pass",
): Promise<string> {
  const swipeLimit = 10;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const currentDate = new Date();
  const lastSwipeDate = user.lastSwipeDate?.toDateString();
  const today = currentDate.toDateString();

  // Check if it's a new day
  if (lastSwipeDate !== today) {
    user.swipeCount = 0;
    user.lastSwipeDate = currentDate;
  }

  // Check swipe limit
  if (!user.isPremium) {
    // Check swipe limit
    if (user.swipeCount >= swipeLimit) {
      throw new Error("Swipe limit reached for today");
    }
  }

  // Check if the profile has already been swiped today
  if (user.swipedProfiles.includes(profileId)) {
    throw new Error("Profile has already been swiped today");
  }

  // Update user's swiped profiles and swipe count
  user.swipedProfiles.push(profileId);

  // Increment swipe count only for non-premium users
  if (!user.isPremium) {
    user.swipeCount += 1;
  }

  await user.save();

  // Handle the swipe action (like or pass)
  if (direction === "like") {
    return "You liked the profile!";
  } else {
    return "You passed on the profile.";
  }
}
