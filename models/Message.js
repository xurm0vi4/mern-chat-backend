import mongoose from 'mongoose';

export const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isBot: {
      type: Boolean,
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Message', messageSchema);
