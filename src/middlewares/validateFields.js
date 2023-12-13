import { validationResult } from "express-validator";

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

export { validateFields };
