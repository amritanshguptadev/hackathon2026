import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Category = mongoose.models.Cate || mongoose.model("Cate", categorySchema);
export default Category;