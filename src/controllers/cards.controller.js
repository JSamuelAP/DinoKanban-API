import cardsServices from "../services/cards.services.js";

const getCards = async (req, res) => {
	const uid = req.uid;
	const { board } = req.body;

	try {
		const response = await cardsServices.getCards(board, uid);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const getCard = async (req, res) => {
	const uid = req.uid;
	const { id } = req.params;

	try {
		const response = await cardsServices.getCard(id, uid);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const createCard = async (req, res) => {
	const uid = req.uid;
	const { title, description, board, list } = req.body;

	try {
		const response = await cardsServices.createCard(uid, {
			title,
			description,
			board,
			list,
		});
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const updateCard = async (req, res) => {
	const uid = req.uid;
	const { id } = req.params;
	const { title, description, list, order } = req.body;

	try {
		const response = await cardsServices.updateCard(id, uid, {
			title,
			description,
			list,
			order,
		});
		res.status(response.status_code).json(response);
	} catch (error) {
		console.log("ERROOOOOOOOOOR", error);
		res.status(error.status_code).json(error);
	}
};

const deleteCard = async (req, res) => {
	const uid = req.uid;
	const { id } = req.params;

	try {
		const response = await cardsServices.deleteCard(id, uid);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

export { getCards, getCard, createCard, updateCard, deleteCard };
