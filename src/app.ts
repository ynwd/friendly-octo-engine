import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import swipeRoutes from "./routes/swipeRoutes";
import premiumRoutes from "./routes/premiumRoutes";
import { connectToMongodb } from "./database";

dotenv.config();
connectToMongodb();

const app = express();
app.use(express.json());
app.get("/", (_req: Request, res: Response) => {
    res.send("Welcome to Express & TypeScript Server");
});
app.use("/api/auth", authRoutes);
app.use("/api/swipe", swipeRoutes);
app.use("/api/premium", premiumRoutes);

export default app;
