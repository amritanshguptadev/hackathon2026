import { React, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function BestDeals() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/deals")
      .then((res) => res.json())
      .then((data) => {
        setDeals(data);
      })
      .catch((err) => {
        console.error("Error fetching deals:", err);
        setDeals([]);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between m-5  md:m-10">
        <div>
          <h2 className="raleway md:pt-5 text-xl font-bold md:text-4xl text-black  font-semi-bold ">
            BEST DEALS
          </h2>
        </div>
        <div className="raleway flex justify-content md:pt-10 text-blue-500 hover:text-blue-600">
          <div>
            <Link to="/all-products" className="flex items-center text-center gap-1 md:text-xl text-blue-600 hover:underline underline-offset-8">
                                            Browse all products <ArrowRight size={16} />
             </Link> 
          </div>
        </div>
      </div>
      <div className="hidden  md:block m-10 border-1 border-gray-400 rounded-xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map((deal, index) => (
            <Link
              to={`/api/product/${deal._id}`}
              key={deal._id}
              className="block"
            >
              <div className="h-full p-4 rounded-md shadow-lg border border-gray-500 hover:shadow-xl transition flex flex-col justify-between">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-40 object-contain mb-2"
                />
                <h2 className="raleway text-lg font-bold">{deal.title}</h2>
                <p className=" raleway text-sm text-gray-600 flex-grow">
                  {deal.description}
                </p>
                <p className="text-xl text-green-600 font-semibold pt-2">₹ {deal.price}.00</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="block sm:hidden p-2">
        <div className="grid grid-cols-2 gap-4 ">
          {deals.slice(0,6).map((deal, index) => (
            <Link
              to={`/api/product/${deal._id}`}
              key={deal._id}
            >
            <div key={index} className="shadow-lg rounded-md">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-40 object-cover"
              />
              <p className="text-green-600 font-semibold text-center py-2">₹ {deal.price}.00</p>
            </div>
            </Link> 
          ))}
        </div>
      </div>
    </div>
  );
}
