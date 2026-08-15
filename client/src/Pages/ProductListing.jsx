import { useState } from "react";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { Upload, X } from "lucide-react";
import { API_URL } from "../config/api";

export default function ProductListing() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    details: "",
    dimensions: "",
    seller: {
      name: "",
      email: "",
      city: "",
      college: ""
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("seller.")) {
      const key = name.split(".")[1];
      setProduct((prev) => ({
        ...prev,
        seller: { ...prev.seller, [key]: value }
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!imageFile) {
    alert("Please select a product image");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("details", product.details);
    formData.append("dimensions", product.dimensions);
    formData.append("seller", JSON.stringify(product.seller));
    formData.append("productImage", imageFile);

    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to submit product");
    }

    const data = await response.json();
    console.log("Product saved:", data);

    // Clear form after successful submit
    setProduct({
      title: "",
      description: "",
      price: "",
      details: "",
      dimensions: "",
      seller: {
        name: "",
        email: "",
        city: "",
        college: "",
      },
    });
    removeImage();

    alert("✅ Product submitted successfully!");
  } catch (error) {
    console.error(error);
    alert("❌ Failed to submit product");
  }
};
  return (
    <>
      <Header showSearchBar={false} />
      <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa] p-6 font-inter">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 md:p-12 border border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            List Your Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                placeholder="Laptop"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Refurbished Laptop, 8GB RAM, 512GB SSD, ideal for coding."
                rows="3"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
                required
              ></textarea>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="28999"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
                required
              />
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Product Image
              </label>
              {!imagePreview ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#1B6392] transition-colors cursor-pointer relative bg-white">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    required
                  />
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-[#1B6392] hover:text-[#1B6392] focus-within:outline-none">
                        <span>Upload a file</span>
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative mt-1 rounded-lg overflow-hidden border border-gray-300 w-full max-w-sm mx-auto">
                  <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover max-h-64" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Product Features (comma-separated)
              </label>
              <textarea
                name="details"
                value={product.details}
                onChange={handleChange}
                placeholder="8GB DDR4 RAM, 512GB SSD, Intel i5 10th Gen..."
                rows="3"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
              ></textarea>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={product.dimensions}
                onChange={handleChange}
                placeholder="32 x 22 x 2 cm"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
              />
            </div>

            {/* Seller Info */}
            <h3 className="text-xl font-bold text-gray-800 mt-8">Seller Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Seller Name
                </label>
                <input
                  type="text"
                  name="seller.name"
                  value={product.seller.name}
                  onChange={handleChange}
                  placeholder="Shahnawaz Hussain"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="seller.email"
                  value={product.seller.email}
                  onChange={handleChange}
                  placeholder="shahussain@gmail.com"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="seller.city"
                  value={product.seller.city}
                  onChange={handleChange}
                  placeholder="Delhi"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  College
                </label>
                <input
                  type="text"
                  name="seller.college"
                  value={product.seller.college}
                  onChange={handleChange}
                  placeholder="Delhi University"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1B6392] focus:ring-1 focus:ring-[#1B6392] transition"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="text-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-[#1B6392] text-white font-bold shadow-md hover:bg-gray-900 transition-all duration-200 transform hover:-translate-y-1"
              >
                Submit Product
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
