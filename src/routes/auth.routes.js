import { Router } from "express";

import {
	validateLoginBody,
	validateSignupBody,
} from "../middlewares/validateFields.js";
import {
	validateRefreshToken,
	validateAccessToken,
} from "../middlewares/validateTokens.js";
import {
	login,
	signup,
	refreshToken,
	logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", validateSignupBody, signup);

router.post("/login", validateLoginBody, login);

router.get("/protected", validateAccessToken, (req, res) =>
	res.json({ protected: true })
);

router.get("/refresh-token", validateRefreshToken, refreshToken);

router.delete("/logout", logout);

export default router;
