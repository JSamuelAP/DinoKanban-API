import Task from '../models/Task.js';
import boardsServices from './boards.services.js';
import formatResponse from '../helpers/formatResponse.js';

/**
 * Get next task order in a status
 * @param {string} board Board ID
 * @param {string} status Status name
 * @returns {Promise<Number>} Promise with next order or error
 * @async
 */
const getNextOrder = async (board, status) =>
  new Promise((resolve, reject) => {
    Task.find({
      board,
      status: status || 'backlog',
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
  tasks.forEach(async (t) => {
    t.order += direction;
    await t.save();
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
    task.order = await getNextOrder(board.data.board.id, task.status)
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
 * Update the order of a task and affected task in it status and/or destination status.
 * Also update the new satus if specified.
 * @param {Object} task Task to update
 * @param {Number} destination New order for the task
 * @param {String|null} status New status for the task
 * @return Updated task or error object
 * @async
 */
const updateTaskOrder = async (task, destination, status) => {
  const source = task.order;

  try {
    if (status && status !== task.status) {
      // Move task to a other status

      // -1 order in tasks with greater than order source in origin status
      await moveTasks(task, { $gt: source }, -1);

      if (destination) {
        // Order destination specified

        // +1 order in tasks with greater than or equal order in destination status
        task.status = status;
        await moveTasks(task, { $gte: destination }, 1);
      } else {
        // Order no specified, move to last position

        destination = await getNextOrder(task.board, status)
          .then((order) => order)
          .catch((error) => {
            throw error;
          });
      }
    } else {
      // Moved to a different position inside same status

      const direction = destination < source ? 'up' : 'down';
      if (direction === 'up')
        await moveTasks(task, { $gte: destination, $lt: source }, 1);
      else if (direction === 'down')
        await moveTasks(task, { $gt: source, $lte: destination }, -1);
    }

    // Just update the new order and status
    const updatedTask = await Task.findOneAndUpdate(
      { _id: task.id },
      {
        order: destination,
        status,
      },
      {
        new: true,
      },
    );
    return updatedTask;
  } catch (error) {
    throw formatResponse(error?.status_code || 500, error?.message);
  }
};

/**
 * Update a task by ID
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

    if (task.destination || task.status) {
      await updateTaskOrder(taskToUpdate, task.destination, task.status);
      delete task.destination;
      delete task.status;
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

    // -1 order in tasks with greather order
    await moveTasks(task, { $gt: task.order }, -1);

    task.deleted = true;
    task.order = 0;
    task.save();

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
