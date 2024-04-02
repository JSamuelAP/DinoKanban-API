import Task from '../models/Task.js';
import boardsServices from './boards.services.js';
import formatResponse from '../helpers/formatResponse.js';

/**
 * Get next task order in a status
 * @param {Object} task Task with board and status info
 * @returns {Promise<Number>} Promise with next order or error
 * @async
 */
const getNextOrder = async (task) =>
  new Promise((resolve, reject) => {
    Task.find({
      board: task.board,
      status: task?.status || 'backlog',
      deleted: false,
    })
      .sort({ order: -1 })
      .limit(1)
      .exec()
      .then((lastTask) =>
        resolve(lastTask.length === 0 ? 1 : lastTask[0].order + 1),
      )
      .catch((error) => reject(formatResponse(500, error.message)));
  });

/**
 * Increment or decrement the order of a range of tasks
 * @param {Object} task Task with board and status info
 * @param {Object} range Mongoose query object with limits for order field
 * @param {Number} direction +1 or -1
 * @async
 */
const moveTasks = async (task, range, direction) => {
  const tasks = await Task.find({
    board: task.board,
    status: task.status,
    order: range,
    deleted: false,
  });
  tasks.forEach(async (c) => {
    c.order += direction;
    await c.save();
  });
};

/**
 * Get all tasks of a board
 * @param {String} boardID Board ID
 * @param {String} uid User ID
 * @return Object response with tasks separated by status or error
 * @async
 */
const getTasks = async (boardID, uid) => {
  const statuses = {
    backlog: [],
    todo: [],
    doing: [],
    done: [],
  };

  try {
    const board = await boardsServices.getBoard(uid, boardID);
    if (!board.success) throw board;

    const tasks = await Task.find({ board: boardID, deleted: false }).sort({
      order: 1,
    });
    tasks.forEach((task) => statuses[task.status].push(task));

    return formatResponse(200, 'Tasks found successfully', { tasks: statuses });
  } catch (error) {
    throw formatResponse(error?.status_code || 500, error?.message);
  }
};

/**
 * Get a task by ID
 * @param {String} id Task ID
 * @param {String} uid User ID
 * @return Object response with task or error
 * @async
 */
const getTask = async (id, uid) => {
  try {
    const task = await Task.findOne({ _id: id, deleted: false });
    if (!task) throw formatResponse(404, 'Task not found');

    const board = await boardsServices.getBoard(uid, task.board);
    if (!board.success) throw formatResponse(404, 'Task not found');

    return formatResponse(200, 'Task found successfully', { task });
  } catch (error) {
    throw formatResponse(error?.status_code || 500, error?.message);
  }
};

/**
 * Create new task. Order is automatically calculated
 * @param {String} uid User ID
 * @param {Object} task Task info
 * @return Object response with created task or error
 * @async
 */
const createTask = async (uid, task) => {
  try {
    const board = await boardsServices.getBoard(uid, task.board);
    if (!board.success) throw board;

    // calculate next order
    task.order = await getNextOrder(task)
      .then((order) => order)
      .catch((error) => {
        throw error;
      });

    const newTask = new Task(task);
    const savedTask = await newTask.save();
    return formatResponse(201, 'Task saved successfully', { task: savedTask });
  } catch (error) {
    throw formatResponse(error?.status_code || 500, error?.message);
  }
};

/**
 * Update a task by ID. If order and/or status is changed, update order of affected tasks too
 * @param {String} id Task ID
 * @param {String} uid User ID
 * @param {Object} task Task changes
 * @return Object response with updated task or error
 * @async
 */
const updateTask = async (id, uid, task) => {
  try {
    const existsTask = await getTask(id, uid);
    if (!existsTask.success) throw existsTask;
    const taskToUpdate = existsTask.data.task;
    task.board = taskToUpdate.board;

    // Moved to a different status
    if (task.status && task.status !== taskToUpdate.status) {
      if (task.order) {
        // -1 order in tasks with greater than order in origin status
        await moveTasks(
          { ...task, status: taskToUpdate.status },
          { $gt: task.order },
          -1,
        );
        // +1 order in tasks with greater than or equal order in destination status
        await moveTasks(task, { $gte: task.order }, 1);
      } else {
        task.order = await getNextOrder(task)
          .then((order) => order)
          .catch((error) => {
            throw error;
          });
      }
    } else if (task.order) {
      // Moved to a different position inside same status
      task.status = taskToUpdate.status;
      // Move to a higher position
      if (task.order < taskToUpdate.order) {
        await moveTasks(task, { $gte: task.order, $lt: taskToUpdate.order }, 1);
      }
      // Move to a lower position
      else if (task.order > taskToUpdate.order) {
        await moveTasks(
          task,
          { $gt: taskToUpdate.order, $lte: task.order },
          -1,
        );
      }
    }

    const updatedTask = await Task.findOneAndUpdate({ _id: id }, task, {
      new: true,
    });
    return formatResponse(200, 'Task updated successfully', {
      task: updatedTask,
    });
  } catch (error) {
    throw formatResponse(error?.status_code || 500, error?.message);
  }
};

/**
 * Delete a task by ID (soft delete) and update order of affected tasks
 * @param {String} id Task ID
 * @param {String} uid User ID
 * @return Object response with deleted task or error
 * @async
 */
const deleteTask = async (id, uid) => {
  try {
    const existsTask = await getTask(id, uid);
    if (!existsTask.success) throw existsTask;

    const { task } = existsTask.data;
    task.deleted = true;
    task.order = 0;
    task.save();

    // -1 order in tasks with greather order
    await moveTasks(task, { $gt: task.order }, -1);

    return formatResponse(200, 'Task deleted successfully', { task });
  } catch (error) {
    throw formatResponse(error?.status_code || 500, error?.message);
  }
};

export default {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
