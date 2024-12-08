import { config } from "dotenv";
config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test";
export const PORT = process.env.PORT || 3000;
export const MONGO_AUTH_SOURCE = process.env.MONGO_AUTH_SOURCE || "admin";
export const MONGO_USER = process.env.MONGO_USER || "root";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "example";
