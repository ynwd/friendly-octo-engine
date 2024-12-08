import User from "../models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { createUser, getUser } from "./userService";

jest.mock("../models/User");
jest.mock("bcrypt"); // Mock bcrypt

describe("register", () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new user with hashed password", async () => {
    const username = "testuser";
    const email = "test@example.com";
    const password = "password123";

    const mockedHashResult = "hashedPassword";
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.resolve(mockedHashResult));
    (User.prototype.save as jest.Mock).mockResolvedValue({
      username,
      email,
      password: mockedHashResult,
      _id: new mongoose.Types.ObjectId(),
    });

    const createdUser = await createUser(username, email, password);

    expect(createdUser).toBeDefined();
    expect(createdUser.username).toBe(username);
    expect(createdUser.email).toBe(email);
    expect(createdUser.password).toBe(mockedHashResult);
  });

  it("should throw an error if user creation fails", async () => {
    const username = "testuser";
    const email = "test@example.com";
    const password = "password123";

    const mockedHashResult = "hashedPassword";
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.resolve(mockedHashResult));
    (User.prototype.save as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(createUser(username, email, password)).rejects.toThrow(
      "Database error",
    );
  });
});

describe("getUser", () => {
  const mockEmail = "test@example.com";
  const mockPassword = "password123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return user data without password if credentials are valid", async () => {
    const mockUser = {
      email: mockEmail,
      password: await bcrypt.hash(mockPassword, 10),
      toObject: jest.fn().mockReturnValue({
        email: mockEmail,
        password: mockPassword,
      }),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await getUser(mockEmail, mockPassword);

    expect(result).toEqual({ email: mockEmail });
    expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockPassword,
      mockUser.password,
    );
  });

  it("should return null if user is not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getUser(mockEmail, mockPassword);

    expect(result).toBeNull();
    expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
  });

  it("should return null if password does not match", async () => {
    const mockUser = {
      email: mockEmail,
      password: await bcrypt.hash(mockPassword, 10),
      toObject: jest.fn().mockReturnValue({
        email: mockEmail,
        password: mockPassword,
      }),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await getUser(mockEmail, mockPassword);

    expect(result).toBeNull();
    expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockPassword,
      mockUser.password,
    );
  });
});
