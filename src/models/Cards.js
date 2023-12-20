import { Schema, model } from "mongoose";

const cardSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		board: {
			type: Schema.Types.ObjectId,
			ref: "Board",
			required: true,
		},
		list: {
			type: String,
			enum: ["backlog", "todo", "doing", "done"],
			default: "backlog",
			required: true,
		},
		order: {
			type: Number,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

cardSchema.methods.toJSON = function () {
	const { __v, deleted, ...card } = this.toObject();
	return card;
};

const Card = model("Card", cardSchema);
export default Card;
