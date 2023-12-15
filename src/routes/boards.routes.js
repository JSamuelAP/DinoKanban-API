import { Router } from "express";

import { validateAccessToken } from "../middlewares/validateTokens.js";
import {
	createBoard,
	getBoard,
	getBoards,
	updateBoard,
	deleteBoard,
} from "../controllers/boards.controller.js";
import {
	validateCreateBoardBody,
	validateGetBoardId,
	validateUpdateBoard,
} from "../middlewares/validateFields.js";

const router = Router();

router.get("/", validateAccessToken, getBoards);

router.get("/:id", validateAccessToken, validateGetBoardId, getBoard);

router.post("/", validateAccessToken, validateCreateBoardBody, createBoard);

router.patch("/:id", validateAccessToken, validateUpdateBoard, updateBoard);

router.delete("/:id", validateAccessToken, validateGetBoardId, deleteBoard);

export default router;
