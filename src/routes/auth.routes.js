import { Router } from "express";

import {
	validateLogin,
	validateSignup,
} from "../middlewares/validateFields.js";
import { validateRefreshToken } from "../middlewares/validateTokens.js";
import {
	login,
	signup,
	refreshToken,
	logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", validateSignup, signup);

router.post("/login", validateLogin, login);

router.get("/refresh-token", validateRefreshToken, refreshToken);

router.delete("/logout", logout);

export default router;
