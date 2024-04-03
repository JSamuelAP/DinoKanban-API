import { validationResult, body, param, query } from 'express-validator';

/**
 * Validate if express-validator found errors
 * @param req
 * @param res
 * @param next
 * @returns JSON response with errors
 */
const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      status_code: 400,
      message: errors.array().map((error) => error.msg),
    });
  }
  next();
};

/**
 * Validate if an ID is mongo ID
 * @param {String} location Location of the key (param, query or body)
 * @param {String} key Name of the param or field
 * @returns {ValidationChain} Validation chain of the ID in params, query or body
 */
const validateID = (location = 'param', key = 'id') => {
  if (location === 'param') {
    return param('id', "Invalid param 'id'").isMongoId();
  }
  if (location === 'body') {
    return body(key, `Invalid key '${key}'`).isMongoId();
  }
  if (location === 'query') {
    return query(key, `Invalid query param '${key}'`).isMongoId();
  }
};

// Auth

const validateSignup = [
  body('username', "Key 'username' is missing or is empty")
    .trim()
    .notEmpty()
    .bail()
    .isLength({ max: 16 })
    .withMessage("Max length for key 'username' is 16 characters"),
  body('email', "Key 'email' is missing or is empty")
    .trim()
    .notEmpty()
    .bail()
    .isEmail()
    .withMessage('Invalid email'),
  body(
    'password',
    'Password must contain 8+ characters, mix of uppercase/lowercase, numbers, and a special character',
  ).isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  body('confirmPassword', "Key 'confirmPassword' is missing or is empty")
    .notEmpty()
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return value;
    }),
  validateFields,
];

const validateLogin = [
  body('email', "Key 'email' is missing or is empty")
    .trim()
    .notEmpty()
    .bail()
    .isEmail()
    .withMessage('Invalid email'),
  body('password', "Key 'password' is missing or is empty").notEmpty(),
  validateFields,
];

// Boards

const validateBoardID = [validateID(), validateFields];

const validateCreateBoard = [
  body('name', "Key 'name' is missing or is empty")
    .trim()
    .notEmpty()
    .bail()
    .isLength({ max: 32 })
    .withMessage("Max length for key 'name' is 32 characters"),
  validateFields,
];

const validateUpdateBoard = [
  validateID(),
  body('name', "Key 'name' is missing or is empty")
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .isLength({ max: 32 })
    .withMessage("Max length for key 'name' is 32 characters"),
  validateFields,
];

// Tasks

const validateGetTasks = [validateID('query', 'board'), validateFields];

const validateTaskID = [validateID(), validateFields];

const validateCreateTask = [
  body('title', "Key 'title' is missing or is empty")
    .trim()
    .notEmpty()
    .bail()
    .isLength({ max: 24 })
    .withMessage("Max length for key 'title' is 24 characters"),
  body('description', "Key 'description' is missing or is empty")
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .isLength({ max: 200 })
    .withMessage("Max length for key 'description' is 200 characters"),
  validateID('body', 'board'),
  body(
    'status',
    "Key 'status' can only be 'backlog', 'todo', 'doing' or 'done'",
  )
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['backlog', 'todo', 'doing', 'done']),
  validateFields,
];

const validateUpdateTask = [
  validateID(),
  body('title', "Key 'title' is empty")
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .isLength({ max: 24 })
    .withMessage("Max length for key 'title' is 24 characters"),
  body('description', "Key 'description' is empty")
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .isLength({ max: 200 })
    .withMessage("Max length for key 'description' is 200 characters"),
  body(
    'status',
    "Key 'status' can only be 'backlog', 'todo', 'doing' or 'done'",
  )
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['backlog', 'todo', 'doing', 'done']),
  body('destination', "Key 'destination' must be a positive integer")
    .optional()
    .isInt({ min: 1, allow_leading_zeroes: false }),
  validateFields,
];

export {
  validateSignup,
  validateLogin,
  validateBoardID,
  validateCreateBoard,
  validateUpdateBoard,
  validateGetTasks,
  validateTaskID,
  validateCreateTask,
  validateUpdateTask,
};
