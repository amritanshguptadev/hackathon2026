import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { API_URL, resolveImageUrl } from "../../../config/api";
import { DEMO_LISTINGS } from "../../../data/images";
import { productService } from "../../../services/productService";

export default function FeatureProducts() {
    const [FeatureProduct, setFeatureProduct] = useState(DEMO_LISTINGS);

    useEffect(() => {
        if (productService?.getProducts) {
            productService.getProducts({ limit: 9 })
                .then((data) => {
                    if (data && data.length > 0) {
                        setFeatureProduct(data);
                    } else {
                        setFeatureProduct(DEMO_LISTINGS);
                    }
                })
                .catch(() => {
                    setFeatureProduct(DEMO_LISTINGS);
                });
        } else {
            fetch(`${API_URL}/api/featured-products`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data) && data.length > 0) {
                        setFeatureProduct(data);
                    }
                })
                .catch(() => {
                    setFeatureProduct(DEMO_LISTINGS);
                });
        }
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
                    {FeatureProduct.slice(0, 9).map((product, index) => {
                        const prodId = product._id || product.id || `bk-item-${index + 1}`;
                        return (
                            <Link
                                key={prodId}
                                to={`/api/product/${prodId}`}
                                className="group"
                            >
                                <div className="p-4 rounded-2xl bg-white shadow-xs border border-indigo-50 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 mb-6 flex flex-col justify-between h-80">
                                    <div className="w-full h-36 md:h-44 bg-slate-50 rounded-xl p-2 flex items-center justify-center overflow-hidden mb-2">
                                        <img
                                            src={resolveImageUrl(product.image)}
                                            alt={product.title}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <p className="line-clamp-2 text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                        {product.title || product.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                                        <p className="text-base text-indigo-700 font-extrabold">
                                            ₹{typeof product.price === "number" ? product.price.toLocaleString("en-IN") : product.price}
                                        </p>
                                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                            {product.condition || 'Verified'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
