import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
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
      ref: 'Board',
      required: true,
    },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'doing', 'done'],
      default: 'backlog',
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
  { timestamps: true },
);

taskSchema.methods.toJSON = function () {
  const { __v, deleted, ...task } = this.toObject();
  return task;
};

const Task = model('Task', taskSchema);
export default Task;
