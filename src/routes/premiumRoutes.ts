import { Router } from "express";
import { purchasePremiumController } from "../controllers/premiumController";
import setCurrentUser from "../middleware/currentUser";

const router = Router();

router.post("/purchase", setCurrentUser, purchasePremiumController);

export default router;
