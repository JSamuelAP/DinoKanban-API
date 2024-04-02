import { Router } from 'express';

import {
  createCard,
  deleteCard,
  getCard,
  getCards,
  updateCard,
} from '../controllers/cards.controller.js';
import { validateAccessToken } from '../middlewares/validateTokens.js';
import {
  validateGetCards,
  validateCardID,
  validateCreateCard,
  validateUpdateCard,
} from '../middlewares/validateFields.js';

const router = Router();

router.get('/', validateAccessToken, validateGetCards, getCards);

router.get('/:id', validateAccessToken, validateCardID, getCard);

router.post('/', validateAccessToken, validateCreateCard, createCard);

router.patch('/:id', validateAccessToken, validateUpdateCard, updateCard);

router.delete('/:id', validateAccessToken, validateCardID, deleteCard);

export default router;
