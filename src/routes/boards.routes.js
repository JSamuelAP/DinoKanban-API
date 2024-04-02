import { Router } from 'express';

import { validateAccessToken } from '../middlewares/validateTokens.js';
import {
  createBoard,
  getBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} from '../controllers/boards.controller.js';
import {
  validateBoardID,
  validateCreateBoard,
  validateUpdateBoard,
} from '../middlewares/validateFields.js';

const router = Router();

router.get('/', validateAccessToken, getBoards);

router.get('/:id', validateAccessToken, validateBoardID, getBoard);

router.post('/', validateAccessToken, validateCreateBoard, createBoard);

router.patch('/:id', validateAccessToken, validateUpdateBoard, updateBoard);

router.delete('/:id', validateAccessToken, validateBoardID, deleteBoard);

export default router;
