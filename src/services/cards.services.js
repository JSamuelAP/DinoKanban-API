import Card from "../models/Cards.js";
import boardsServices from "./boards.services.js";
import { formatResponse } from "../helpers/formatResponse.js";

/**
 * Get all cards of a board
 * @param {String} boardID Board ID
 * @param {String} uid User ID
 * @return Object response with cards separated in lists or error
 * @async
 */
const getCards = async (boardID, uid) => {
	const lists = {
		backlog: [],
		todo: [],
		doing: [],
		done: [],
	};

	try {
		const board = await boardsServices.getBoard(uid, boardID);
		if (!board.success) throw board;

		const cards = await Card.find({ board: boardID, deleted: false }).sort({
			order: 1,
		});
		cards.forEach((card) => lists[card.list].push(card));

		return formatResponse(200, "Cards found successfully", { cards: lists });
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Get a card by ID
 * @param {String} id Card ID
 * @param {String} uid User ID
 * @return Object response with card or error
 * @async
 */
const getCard = async (id, uid) => {
	try {
		const card = await Card.findOne({ _id: id, deleted: false });
		if (!card) throw formatResponse(404, "Card not found");

		const board = await boardsServices.getBoard(uid, card.board);
		if (!board.success) throw formatResponse(404, "Card not found");

		return formatResponse(200, "Card found successfully", { card });
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Create new card. Order is automatically calculated
 * @param {String} uid User ID
 * @param {Object} card Card info
 * @return Object response with created card or error
 * @async
 */
const createCard = async (uid, card) => {
	try {
		const board = await boardsServices.getBoard(uid, card.board);
		if (!board.success) throw board;

		// calculate next order
		card.order = await getNextOrder(card)
			.then((order) => order)
			.catch((error) => {
				throw error;
			});

		const newCard = new Card(card);
		const savedCard = await newCard.save();
		return formatResponse(201, "Card saved successfully", { card: savedCard });
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Update a card by ID. If order and/or list is changed, update order of affected cards too
 * @param {String} id Card ID
 * @param {String} uid User ID
 * @param {Object} card Card changes
 * @return Object response with updated card or error
 * @async
 */
const updateCard = async (id, uid, card) => {
	try {
		const existsCard = await getCard(id, uid);
		if (!existsCard.success) throw existsCard;
		const cardToUpdate = existsCard.data.card;
		card.board = cardToUpdate.board;

		// Moved to a different list
		if (card.list && card.list !== cardToUpdate.list) {
			if (card.order) {
				// -1 order in cards with greather than order in origin list
				await moveCards(
					{ ...card, list: cardToUpdate.list },
					{ $gt: card.order },
					-1
				);
				// +1 order in cards with greather than or equal order in destination list
				await moveCards(card, { $gte: card.order }, 1);
			} else
				card.order = await getNextOrder(card)
					.then((order) => order)
					.catch((error) => {
						throw error;
					});
		} else if (card.order) {
			// Moved to a different position inside same list
			card.list = cardToUpdate.list;
			// Move to a higher position
			if (card.order < cardToUpdate.order)
				await moveCards(card, { $gte: card.order, $lt: cardToUpdate.order }, 1);
			// Move to a lower position
			else if (card.order > cardToUpdate.order)
				await moveCards(
					card,
					{ $gt: cardToUpdate.order, $lte: card.order },
					-1
				);
		}

		const updatedCard = await Card.findOneAndUpdate({ _id: id }, card, {
			new: true,
		});
		return formatResponse(200, "Card updated successfully", {
			card: updatedCard,
		});
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Delete a card by ID (soft delete) and update order of affected cards
 * @param {String} id Card ID
 * @param {String} uid User ID
 * @return Object response with deleted card or error
 * @async
 */
const deleteCard = async (id, uid) => {
	try {
		const existsCard = await getCard(id, uid);
		if (!existsCard.success) throw existsCard;

		const card = existsCard.data.card;
		card.deleted = true;
		card.order = 0;
		card.save();

		// -1 order in cards with greather order
		await moveCards(card, { $gt: card.order }, -1);

		return formatResponse(200, "Card deleted successfully", { card });
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Get next card order in a list
 * @param {Object} card Card with board and list info
 * @returns {Promise<Number>} Promise with next order or error
 * @async
 */
const getNextOrder = async (card) => {
	return new Promise((resolve, reject) => {
		Card.find({
			board: card.board,
			list: card?.list || "backlog",
			deleted: false,
		})
			.sort({ order: -1 })
			.limit(1)
			.exec()
			.then((lastCard) =>
				resolve(lastCard.length === 0 ? 1 : lastCard[0].order + 1)
			)
			.catch((error) => reject(formatResponse(500, error.message)));
	});
};

/**
 * Increment or decrement the order of a range of cards
 * @param {Object} card Card with board and list info
 * @param {Object} range Mongoose query object with limits for order field
 * @param {Number} direction +1 or -1
 * @async
 */
const moveCards = async (card, range, direction) => {
	const cards = await Card.find({
		board: card.board,
		list: card.list,
		order: range,
		deleted: false,
	});
	cards.forEach(async (card) => {
		card.order += direction;
		await card.save();
	});
};

export default { getCards, getCard, createCard, updateCard, deleteCard };
