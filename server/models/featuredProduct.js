import mongoose from 'mongoose';

const featuredProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: 'Hostel Essentials',
  },
  condition: {
    type: String,
    enum: ['Like New', 'Good', 'Fair'],
    default: 'Good',
  },
  campusLocation: {
    type: String,
    default: 'Campus Gate',
  },
  location: {
    type: String,
    default: 'Campus',
  },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Sold'],
    default: 'Available',
  },
  details: {
    type: Array,
    default: [],
  },
  dimensions: {
    type: String,
  },
  seller: {
    type: Object,
    default: {},
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FeaturedProduct =
  mongoose.models.FeaturedProduct ||
  mongoose.model('FeaturedProduct', featuredProductSchema);

export default FeaturedProduct;