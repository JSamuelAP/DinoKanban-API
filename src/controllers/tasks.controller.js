import tasksServices from '../services/tasks.services.js';

const getTasks = async (req, res) => {
  const { uid } = req;
  const { board } = req.query;

  try {
    const response = await tasksServices.getTasks(board, uid);
    res.status(response.status_code).json(response);
  } catch (error) {
    res.status(error.status_code).json(error);
  }
};

const getTask = async (req, res) => {
  const { uid } = req;
  const { id } = req.params;

  try {
    const response = await tasksServices.getTask(id, uid);
    res.status(response.status_code).json(response);
  } catch (error) {
    res.status(error.status_code).json(error);
  }
};

const createTask = async (req, res) => {
  const { uid } = req;
  const { title, description, board, status } = req.body;

  try {
    const response = await tasksServices.createTask(uid, {
      title,
      description,
      board,
      status,
    });
    res.status(response.status_code).json(response);
  } catch (error) {
    res.status(error.status_code).json(error);
  }
};

const updateTask = async (req, res) => {
  const { uid } = req;
  const { id } = req.params;
  const { title, description, destination, status } = req.body;

  try {
    const response = await tasksServices.updateTask(id, uid, {
      title,
      description,
      destination,
      status,
    });
    res.status(response.status_code).json(response);
  } catch (error) {
    res.status(error.status_code).json(error);
  }
};

const deleteTask = async (req, res) => {
  const { uid } = req;
  const { id } = req.params;

  try {
    const response = await tasksServices.deleteTask(id, uid);
    res.status(response.status_code).json(response);
  } catch (error) {
    res.status(error.status_code).json(error);
  }
};

export { getTasks, getTask, createTask, updateTask, deleteTask };
