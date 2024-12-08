import express from "express";
import { swipeProfileController } from "../controllers/swipeController";
import setCurrentUser from '../middleware/currentUser';

const router = express.Router();

router.post("/swipe", setCurrentUser, swipeProfileController);

export default router;
