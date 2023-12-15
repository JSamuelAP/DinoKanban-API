import mongoose from "mongoose";
const { Schema, model } = mongoose;

const boardSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

boardSchema.methods.toJSON = function () {
	const { __v, deleted, ...board } = this.toObject();
	return board;
};

const Board = model("Board", boardSchema);
export default Board;
