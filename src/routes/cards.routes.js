import { Router } from "express";

import {
	createCard,
	deleteCard,
	getCard,
	getCards,
	updateCard,
} from "../controllers/cards.controller.js";
import { validateAccessToken } from "../middlewares/validateTokens.js";
import {
	validateBoardIdBody,
	validateCardId,
	validateCreateCardBody,
	validateUpdateCardBody,
} from "../middlewares/validateFields.js";

const router = Router();

router.get("/", validateAccessToken, validateBoardIdBody, getCards);

router.get("/:id", validateAccessToken, validateCardId, getCard);

router.post("/", validateAccessToken, validateCreateCardBody, createCard);

router.patch("/:id", validateAccessToken, validateUpdateCardBody, updateCard);

router.delete("/:id", validateAccessToken, validateCardId, deleteCard);

export default router;
