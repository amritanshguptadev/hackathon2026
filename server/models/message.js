import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation reference is required'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Sender reference is required'],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Receiver reference is required'],
      validate: {
        validator: function (value) {
          if (!this.sender || !value) return true;
          return this.sender.toString() !== value.toString();
        },
        message: 'Sender and receiver must be different users',
      },
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
      maxlength: [2000, 'Message text cannot exceed 2000 characters'],
      validate: {
        validator: function (value) {
          return typeof value === 'string' && value.trim().length > 0;
        },
        message: 'Message text cannot be empty',
      },
    },
    type: {
      type: String,
      enum: {
        values: ['text', 'offer', 'system'],
        message: '{VALUE} is not a supported message type',
      },
      default: 'text',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to guarantee sender and receiver are different
messageSchema.pre('validate', function (next) {
  if (this.sender && this.receiver && this.sender.toString() === this.receiver.toString()) {
    this.invalidate('receiver', 'Sender and receiver must be different users');
  }
  next();
});

// Query index for fetching chronological message history inside a conversation
messageSchema.index({ conversation: 1, createdAt: 1 });

// Query index for marking messages as read for a specific receiver in a conversation
messageSchema.index({ conversation: 1, receiver: 1, read: 1 });

// Query index for counting total unread messages for a user across all conversations
messageSchema.index({ receiver: 1, read: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
