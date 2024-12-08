import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";

/**
 * createUser service
 *
 * @param username
 * @param email
 * @param password
 * @returns
 */
export async function createUser(
  username: string,
  email: string,
  password: string,
) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = new User({ username, email, password: hashedPassword });
  return await newUser.save();
}

/**
 * getUser service
 * @param email
 * @param password
 * @returns
 */
export async function getUser(
  email: string,
  password: string,
): Promise<IUser | null> {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const { password: _, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword as IUser;
}
