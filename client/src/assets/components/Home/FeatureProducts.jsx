import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'


export default function FeatureProducts() {
    const [FeatureProduct, setFeatureProduct] = useState([]);

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
            <div className="w-full  flex flex-col p-2">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="raleway text-xl md:text-4xl font-semibold">
                            Feature Products
                        </h2>
                        <nav className="raleway flex flex-wrap gap-2 md:gap-5  text-sm md:text-base items-center px-2">
                            <Link to="" className='hidden md:flex hover:text-orange-400 hover:underline underline-offset-8'>All Products</Link>
                            <Link to="" className='hidden md:flex hover:text-orange-400 hover:underline underline-offset-8'>Laptop</Link>
                            <Link to="" className='hidden md:flex hover:text-orange-400 hover:underline underline-offset-8'>Books</Link>
                            <Link to="" className='hidden md:flex hover:text-orange-400 hover:underline underline-offset-8'>Furniture</Link>
                            <Link to="" className='hidden md:flex hover:text-orange-400 hover:underline underline-offset-8'>Utensils</Link>
                            <Link to="/all-products" className="flex items-center text-center gap-1 text-orange-400 hover:underline underline-offset-8 hover:text-orange-500">
                                Browse all products <ArrowRight size={16} />
                            </Link>
                        </nav>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                    {FeatureProduct.slice(0, 9).map((product) => (
                        <Link key={product._id}
                        to={`/api/product/${product._id}`}
                        >
                            <div
                            key={product.id}
                            className="p-4 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition mb-10 h-80"
                        >
                                <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-30 md:h-40 object-contain mb-2"
                            />
                            <p className=" raleway line-clamp-5  text-md text-gray-700 ">{product.description}</p>
                            <p className="text-xl text-green-600 font-semibold mt-5 md:mt-2">₹ {product.price}.00</p>
                        </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
