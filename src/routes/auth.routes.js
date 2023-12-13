import { Router } from "express";

import { login, signup } from "../controllers/auth.controller.js";
import { validateFields } from "../middlewares/validateFields.js";
import { body } from "express-validator";

const router = Router();

router.post(
	"/signup",
	[
		body("username", "Key 'username' is missing or is empty")
			.trim()
			.notEmpty()
			.bail()
			.isLength({ max: 16 })
			.withMessage("Max length for key 'username' is 16 characters"),
		body("email", "Key 'email' is missing or is empty")
			.trim()
			.notEmpty()
			.bail()
			.isEmail()
			.withMessage("Invalid email"),
		body(
			"password",
			"Password must contain 8+ characters, mix of uppercase/lowercase, numbers, and a special character"
		).isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		}),
		body("confirmPassword", "Key 'confirmPassword' is missing or is empty")
			.notEmpty()
			.bail()
			.custom((value, { req }) => {
				if (value !== req.body.password)
					throw new Error("Passwords do not match");
				return value;
			}),
	],
	validateFields,
	signup
);

router.post(
	"/login",
	[
		body("email", "Key 'email' is missing or is empty")
			.trim()
			.notEmpty()
			.bail()
			.isEmail()
			.withMessage("Invalid email"),
		body("password", "Key 'password' is missing or is empty").notEmpty(),
		validateFields,
	],
	login
);

router.post("/refresh-token");

router.delete("/logout");

export default router;
