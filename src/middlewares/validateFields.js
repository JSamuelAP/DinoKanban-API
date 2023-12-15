import { validationResult, body } from "express-validator";

/**
 * Validate if express-validator found errors
 * @param req
 * @param res
 * @param next
 * @returns JSON response with errors
 */
const validateFields = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).json({
			success: false,
			status_code: 400,
			message: errors.array().map((error) => error.msg),
		});
	next();
};

const validateSignupBody = [
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
	validateFields,
];

const validateLoginBody = [
	body("email", "Key 'email' is missing or is empty")
		.trim()
		.notEmpty()
		.bail()
		.isEmail()
		.withMessage("Invalid email"),
	body("password", "Key 'password' is missing or is empty").notEmpty(),
	validateFields,
];

export { validateSignupBody, validateLoginBody };
