import request from "supertest";
import app from "../app";
import User from "../models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

describe("Purchase Premium Package E2E Tests", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const user = await User.create({
      username: "testuser456",
      email: "test456@example.com",
      password: "password456",
    });

    userId = user._id as string;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "jwt_secret", {
      expiresIn: "1h",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await mongoose.disconnect();
  });

  it("should successfully purchase a premium package", async () => {
    const response = await request(app)
      .post("/api/premium/purchase")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Premium package purchased successfully. You now have unlimited swipes and a verified label.",
    );

    const updatedUser = await User.findById(userId);
    expect(updatedUser?.isPremium).toBe(true);
    expect(updatedUser?.isVerified).toBe(true);
  });
});
