import { connect, connection } from "mongoose";
import {
  MONGODB_URI,
  MONGO_AUTH_SOURCE,
  MONGO_PASSWORD,
  MONGO_USER,
} from "./config";

export async function connectToMongodb() {
  try {
    await connect(MONGODB_URI, {
      authSource: MONGO_AUTH_SOURCE,
      user: MONGO_USER,
      pass: MONGO_PASSWORD,
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

connection.on("connected", () => {
  console.log("Mongodb connected to:", connection.db?.databaseName);
});

connection.on("error", (error) => {
  console.error("error", error);
});

connection.on("disconnected", () => {
  console.log("Mongodb disconnected");
});
