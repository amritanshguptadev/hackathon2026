import { useEffect, useState } from "react";
import { useParams , useNavigate, Link } from "react-router-dom";
import Header from "../Home/Header";
import { Loader,ArrowLeft } from "lucide-react";
import Footer from "../Home/Footer";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);

  if (!product.title) {
    return (
      <div className="text-center p-4">
        <Loader size={50} color="black" />
      </div>
    );
  }

  return (
    <>
      <Header showSearchBar={false} />
      <div>
        <div className="px-4 py-1 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 font-semibold hover:underline "
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>
      </div>
        <div className="bg-black w-full h-[1px]" />
        <div className="flex flex-col md:flex-row justify-center w-19/20">
          <div className="bg-white h-full md:sticky top-0 w-full md:w-1/3 flex justify-center">
            <div>
              <img
                src={product.image}
                className=" h-64 md:h-130 p-6 md:p-10 object-contain my-4 md:my-10 "
              />
            </div>
          </div>

          <div className="m-4 md:m-10 w-full md:w-2/3">
            <div className="md:w-2/4">
              <p className="raleway text-xl md:text-2xl font-black pb-1">
                {product.description}
              </p>
              <p className="raleway text-sm font-black text-gray-500 pb-5">
                Sell by{" "}
                <Link className="text-black cursor-pointer">
                  {product.seller?.name}
                </Link>
              </p>
              <p className="text-xl md:text-2xl pb-5">₹ {product.price}.00</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-18/20 m-auto">
              <button className="px-6 py-2 bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600 transition ">
                <Link to="/upcoming">Buy now</Link>
              </button>
              <Link
                to={`mailto:${product.seller.email}`}
                className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 transition text-center"
              >
                Contact Seller
              </Link>
            </div>
            <div className="w-full md:w-3/4 py-10">
              <div className="bg-gray-300 w-full h-[1px]" />
            </div>

            <div className="w-full  md:w-3/4">
              <h2 className="raleway text-xl md:text-2xl font-black mb-2">
                About this Product
              </h2>
              <ul className="raleway text-md list-disc list-inside space-y-1">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-3/4 py-10">
              <div className="bg-gray-300 w-full h-[1px]" />
            </div>
            <div className="w-full md:w-3/4">
              <h2 className="raleway text-xl md:text-2xl font-black mb-2">
                About the Seller
              </h2>
              <ul className="raleway text-md list-disc list-inside space-y-1">
                <li>
                  <span className="font-medium">Sold by:</span>{" "}
                  {product.seller.name}
                </li>
                <li>
                  <span className="font-medium">College:</span>{" "}
                  {product.seller.college}
                </li>
                <li>
                  <span className="font-medium">City:</span>{" "}
                  {product.seller.city}
                </li>
                <li>
                  <span className="font-medium">Email:</span>{" "}
                  <Link
                    to={`mailto:${product.seller.email}`}
                    className="text-blue-600 hover:underline underline-offset-4 hover:text-orange-500"
                  >
                    {product.seller.email}
                  </Link>
                </li>
                <li>
                  <span className="font-medium">Joined in:</span>{" "}
                  {new Date(product.seller?.joinedAt).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "long",
                    }
                  )}
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 p-5 md:w-3/4 justify-items-start">
              <button className="cursor-pointer w-full px-4 py-2 font-black text-black bg-yellow-400 rounded-md opacity-80 hover:opacity-100">
                <Link to="/upcoming">Buy Now</Link>
              </button>
              <button className="cursor-pointer w-full px-4 py-2 font-black text-black bg-orange-400 rounded-md opacity-90 hover:opacity-100">
                <Link to="/upcoming">Add to Cart</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
