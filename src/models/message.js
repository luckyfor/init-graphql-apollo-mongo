import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const message = mongoose.model('Message', MessageSchema);
export default message;
