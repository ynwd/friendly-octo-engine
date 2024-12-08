import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import User from "../models/User";

describe("User Registration & Login E2E Tests", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await mongoose.disconnect();
  });

  it("should register a new user successfully", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(newUser)
      .expect(201);

    expect(response.body.message).toBe("User registered successfully");

    const createdUser = await User.findOne({ email: newUser.email });
    expect(createdUser).toBeDefined();
    expect(createdUser?.username).toBe(newUser.username);
  });

  it("should not register a user with an existing email", async () => {
    const existingUser = {
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    };

    await request(app)
      .post("/api/auth/register")
      .send(existingUser)
      .expect(201);

    const response = await request(app)
      .post("/api/auth/register")
      .send(existingUser)
      .expect(400);

    expect(response.body.message).toBe("Failed to register user.");
  });

  it("should return 200 for valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "existing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
  });

  it("should return 401 for invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "invalidUser",
      password: "wrongPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});
