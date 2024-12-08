import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  swipeCount: number;
  lastSwipeDate?: Date;
  swipedProfiles: string[];
  // Premium user
  isPremium: boolean;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  swipeCount: { type: Number, default: 0 },
  lastSwipeDate: { type: Date },
  swipedProfiles: { type: [String], default: [] },
  isPremium: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model<IUser>("User", userSchema);
