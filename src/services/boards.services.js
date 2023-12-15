import Board from "../models/Board.js";
import { formatResponse } from "../helpers/formatResponse.js";

/**
 * Get all user boards
 * @param {String} uid User ID
 * @returns Response object with boards array or error
 * @async
 */
const getBoards = async (uid) => {
	try {
		const boards = await Board.find({ user: uid, deleted: false });
		return formatResponse(200, "User boards found successfully", { boards });
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Get one board by ID
 * @param {String} uid User ID
 * @param {String} id Board ID
 * @returns Response Object with board or error
 * @async
 */
const getBoard = async (uid, id) => {
	try {
		const board = await Board.findOne({ user: uid, _id: id, deleted: false });
		if (!board) throw formatResponse(404, "Board not found");
		return formatResponse(200, "Board found successfully", { board });
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Create new board
 * @param {String} uid User ID
 * @param {String} name Board name
 * @returns Response Object with created board or error
 * @async
 */
const createBoard = async (uid, name) => {
	try {
		const newBoard = new Board({ name, user: uid });
		const savedBoard = await newBoard.save();
		return formatResponse(201, "Board created successfully", {
			board: savedBoard,
		});
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Update one board by ID
 * @param {String} id Board ID
 * @param {String} uid User ID
 * @param {String} name New board name
 * @returns Response Object with updated board or error
 * @async
 */
const updateBoard = async (id, uid, name) => {
	try {
		const board = await Board.findOneAndUpdate(
			{ user: uid, _id: id, deleted: false },
			{ name },
			{ new: true }
		);
		if (!board) throw formatResponse(404, "Board not found");
		return formatResponse(200, "Board updated successfully", { board });
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Delete one board by ID (soft delete)
 * @param {String} uid User ID
 * @param {String} id Board ID
 * @returns Response Object with deleted board or error
 * @async
 */
const deleteBoard = async (uid, id) => {
	try {
		const board = await Board.findOneAndUpdate(
			{ user: uid, _id: id, deleted: false },
			{ deleted: true },
			{ new: true }
		);
		if (!board) throw formatResponse(404, "Board not found");
		return formatResponse(200, "Board deleted successfully", { board });
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

export default { getBoards, getBoard, createBoard, updateBoard, deleteBoard };
