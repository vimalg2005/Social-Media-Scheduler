import { Router } from "express";
import { loginUser, registerUser, upgradeUser, downgradeUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddlewware.js";

const authRouter = Router();

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.put('/upgrade', protect, upgradeUser)
authRouter.put('/downgrade', protect, downgradeUser)

export default authRouter;