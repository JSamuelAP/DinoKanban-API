import { Router } from 'express';

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from '../controllers/tasks.controller.js';
import { validateAccessToken } from '../middlewares/validateTokens.js';
import {
  validateGetTasks,
  validateTaskID,
  validateCreateTask,
  validateUpdateTask,
} from '../middlewares/validateFields.js';

const router = Router();

router.get('/', validateAccessToken, validateGetTasks, getTasks);

router.get('/:id', validateAccessToken, validateTaskID, getTask);

router.post('/', validateAccessToken, validateCreateTask, createTask);

router.patch('/:id', validateAccessToken, validateUpdateTask, updateTask);

router.delete('/:id', validateAccessToken, validateTaskID, deleteTask);

export default router;
