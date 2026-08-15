import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import { API_URL, resolveImageUrl } from "../../../config/api";


export default function FeatureProducts() {
    const [FeatureProduct, setFeatureProduct] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/featured-products`)
            .then((res) => res.json())
            .then((data) => {
                setFeatureProduct(data);
            })
            .catch((err) => {
                console.error("Error fetching deals:", err);
                setFeatureProduct([]);
            });
    }, []);

    return (
        <section className=" w-full block md:flex ">
            <div>
                <img
                    src="/Sale/image.png"
                    alt="Featured Sale Product"
                    className="hidden md:block h-full cursor-not-allowed"
                />
                <div className="block mb-5 md:hidden flex justify-center">
                    <Link to="/">
                        <img
                            src="/Sale/imageCropped.png"
                            alt="Featured Sale Product"
                            className="h-[300px] w-[400px]"
                        />
                    </Link>
                </div>
            </div>
            <div className="w-full flex flex-col p-2">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl md:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                            Featured Products
                        </h2>
                        <nav className="flex flex-wrap gap-2 md:gap-4 text-sm md:text-base items-center px-2">
                            <Link to="/all-products" className='hidden md:flex text-slate-600 hover:text-indigo-600 font-medium transition'>All Products</Link>
                            <Link to="/all-products" className='hidden md:flex text-slate-600 hover:text-indigo-600 font-medium transition'>Laptops</Link>
                            <Link to="/all-products" className='hidden md:flex text-slate-600 hover:text-indigo-600 font-medium transition'>Books</Link>
                            <Link to="/all-products" className='hidden md:flex text-slate-600 hover:text-indigo-600 font-medium transition'>Furniture</Link>
                            <Link to="/all-products" className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition">
                                Browse all products <ArrowRight size={16} />
                            </Link>
                        </nav>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                    {FeatureProduct.slice(0, 9).map((product) => (
                        <Link key={product._id}
                        to={`/api/product/${product._id}`}
                        className="group"
                        >
                            <div
                            className="p-4 rounded-2xl bg-white shadow-xs border border-indigo-50 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 mb-6 flex flex-col justify-between h-80"
                        >
                                <img
                                src={resolveImageUrl(product.image)}
                                alt={product.title}
                                className="w-full h-32 md:h-40 object-contain mb-2 transition-transform duration-300 group-hover:scale-105"
                            />
                            <p className="line-clamp-3 text-sm font-medium text-slate-700">{product.title || product.description}</p>
                            <p className="text-lg text-emerald-600 font-bold mt-2">₹{product.price}</p>
                        </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
