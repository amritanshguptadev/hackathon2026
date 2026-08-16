import mongoose from 'mongoose';
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Buyer reference is required'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Seller reference is required'],
      validate: {
        validator: function (value) {
          if (!this.buyer || !value) return true;
          return this.buyer.toString() !== value.toString();
        },
        message: 'Buyer and seller must be different users',
      },
    },
    product: {
      type: Schema.Types.ObjectId,
      refPath: 'productModel',
      required: [true, 'Product reference is required'],
    },
    productModel: {
      type: String,
      enum: ['FeaturedProduct', 'Deal'],
      default: 'FeaturedProduct',
    },
    lastMessage: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Last message cannot exceed 2000 characters'],
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
    buyerUnreadCount: {
      type: Number,
      default: 0,
      min: [0, 'Buyer unread count cannot be negative'],
    },
    sellerUnreadCount: {
      type: Number,
      default: 0,
      min: [0, 'Seller unread count cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to guarantee buyer and seller are different
conversationSchema.pre('validate', function (next) {
  if (this.buyer && this.seller && this.buyer.toString() === this.seller.toString()) {
    this.invalidate('seller', 'Buyer and seller must be different users');
  }
  next();
});

// Compound unique index: Prevent duplicate conversations for the same buyer + seller + product combination
conversationSchema.index({ buyer: 1, seller: 1, product: 1 }, { unique: true });

// Query indexes for listing user conversations efficiently sorted by recent activity
conversationSchema.index({ buyer: 1, updatedAt: -1 });
conversationSchema.index({ seller: 1, updatedAt: -1 });

// Query index for finding conversations linked to a specific product
conversationSchema.index({ product: 1 });

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

export default Conversation;
