import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import Header from '../Home/Header';
import Footer from '../Home/Footer';

export default function AllProducts(){
    const [FeatureProduct, setFeatureProduct] = useState([]);
    const [deals, setDeals] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetch("http://localhost:3000/api/featured-products")
            .then((res) => res.json())
            .then((data) => {
                setFeatureProduct(data);
            })
            .catch((err) => {
                console.error("Error fetching deals:", err);
                setFeatureProduct([]);
            });
    }, []);
    
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
            <>
                <Header />
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
                <section className=" w-full px-4 md:px-10 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="raleway text-xl md:text-4xl font-bold text-gray-800">
                            Explore Our Curated Collection
                            <span className="raleway text-gray-500 block text-sm md:text-lg font-normal mt-1">
                            Handpicked products for students — grab the best deals today!
                            </span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 pb-2 ">
                    {FeatureProduct.map((product) => (
                        <Link key={product._id} to={`/api/product/${product._id}`}>
                        <div className="bg-white p-2 md:p-4 rounded-md shadow hover:shadow-xl border border-gray-300 transition-all duration-300 h-full md:h-80 flex flex-col justify-between">
                            <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-32 md:h-40 object-contain mb-3"
                            />
                            <div className="flex flex-col flex-grow">
                            <p className="raleway text-sm md:text-xl text-gray-700 font-medium">{product.title}</p>
                            <p className="raleway line-clamp-3 text-xs md:text-sm text-gray-500 mt-1 ">{product.description}</p>
                            <p className="text-green-600 font-bold text-base mt-auto sm:pt-2">₹ {product.price}.00</p>
                            </div>
                        </div>
                        </Link>
                    ))}
                    {deals.map((product) => (
                        <Link key={product._id} to={`/api/product/${product._id}`}>
                        <div className="bg-white p-2 md:p-4 rounded-md shadow hover:shadow-xl border border-gray-300 transition-all duration-300 h-full md:h-80 flex flex-col justify-between">
                            <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-32 md:h-40 object-contain mb-3"
                            />
                            <div className="flex flex-col flex-grow">
                            <p className="raleway text-sm md:text-xl  text-gray-700 font-medium">{product.title}</p>
                            <p className="raleway line-clamp-3 text-xs md:text-sm text-gray-500 mt-1">{product.description}</p>
                            <p className="text-green-600 font-bold text-base mt-auto sm:pt-2">₹ {product.price}.00</p>
                            </div>
                        </div>
                        </Link>
                    ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 pb-10">
                    
                    </div>
                </section>
                <Footer/>
            </>
    );
}
