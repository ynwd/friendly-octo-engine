import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import { swipeProfile } from "../services/swipeService";

jest.mock("../services/SwipeService");

describe("Swipe Profile E2E Tests", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await User.deleteMany({});
    const user = await User.create({
      username: "testuser12345",
      email: "test12345@example.com",
      password: "password12345",
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

  it("should successfully like a profile", async () => {
    (swipeProfile as jest.Mock).mockResolvedValue("You liked the profile!");

    const response = await request(app)
      .post("/api/swipe/swipe")
      .set("Authorization", `Bearer ${token}`)
      .send({ profileId: "profileId123", direction: "like" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You liked the profile!");
  });

  it("should successfully pass on a profile", async () => {
    (swipeProfile as jest.Mock).mockResolvedValue("You passed on the profile.");

    const response = await request(app)
      .post("/api/swipe/swipe")
      .set("Authorization", `Bearer ${token}`)
      .send({ profileId: "profileId123", direction: "pass" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You passed on the profile.");
  });

  it("should return 400 if an error occurs during swiping", async () => {
    (swipeProfile as jest.Mock).mockRejectedValue(
      new Error("Swipe limit reached for today"),
    );

    const response = await request(app)
      .post("/api/swipe/swipe")
      .set("Authorization", `Bearer ${token}`)
      .send({ profileId: "profileId123", direction: "like" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Swipe limit reached for today");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app)
      .post("/api/swipe/swipe")
      .send({ profileId: "profileId123", direction: "like" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization token is required");
  });
});
