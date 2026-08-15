import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  details: Array,
  dimensions: String,
  seller: Object,
});

const Deal = mongoose.models.Deal || mongoose.model("Deal", dealSchema);
export default Deal;
