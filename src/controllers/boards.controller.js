import boardsServices from "../services/boards.services.js";

const getBoards = async (req, res) => {
	const uid = req.uid;

	try {
		const response = await boardsServices.getBoards(uid);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const getBoard = async (req, res) => {
	const id = req.params.id;
	const uid = req.uid;

	try {
		const response = await boardsServices.getBoard(uid, id);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const createBoard = async (req, res) => {
	const { name } = req.body;
	const uid = req.uid;

	try {
		const response = await boardsServices.createBoard(uid, name);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const updateBoard = async (req, res) => {
	const id = req.params.id;
	const { name } = req.body;
	const uid = req.uid;

	try {
		const response = await boardsServices.updateBoard(id, uid, name);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const deleteBoard = async (req, res) => {
	const id = req.params.id;
	const uid = req.uid;

	try {
		const response = await boardsServices.deleteBoard(uid, id);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

export { getBoards, getBoard, createBoard, updateBoard, deleteBoard };
