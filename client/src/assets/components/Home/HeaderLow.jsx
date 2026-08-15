import { MapPin, Info, Headphones, Mail } from "lucide-react";
import SearchBar from "./SearchBar";
import React, { useEffect, useState, useRef } from "react";
import {Link} from 'react-router-dom'

export default function HeaderLow({showSearchBar=true}) {
  
  const [categories, setCategories] = useState([]);
    useEffect(() => {
      fetch("http://localhost:3000/api/category")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
          setCategories([]);
        });
    }, []);
  return (
    <>
      <div className="raleway w-full bg-white border-b border-gray-200 text-sm lg:text-md">
      <div className="hidden md:flex justify-between items-center px-4 py-3">
        <div className="flex gap-6 items-center">
          <select className=" border ml-2 px- py-1 rounded">
            <option >
                Select Category
            </option>
            {categories.map((category, index) => (
                <option key={index} >
                  {category.name}
                </option>
            ))}
          </select>
          <Link to="/upcoming" className="flex items-center gap-1">
            <MapPin size={18} /> Track Order
          </Link>
          <Link to="/product-listing">Sell</Link>
          <Link to="/upcoming">Buy</Link>
          <Link to="mailto:shahnawaz.hussain96508@gmail.com" className="flex items-center gap-1">
            <Info size={18} /> Need Help
          </Link>
          <Link to="/contact" className="flex items-center gap-1">
            <Headphones size={18} /> Support
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <Mail size={18} />
          <span>
            <Link to="mailto:shahnawaz.hussain96508@gmail.com">
              shahnawaz.hussain96508@gmail.com
            </Link>
          </span>
        </div>
      </div>
    </div>
    <div className="flex md:hidden w-full px-5">
      {showSearchBar && (<SearchBar showSearchBar={true}/>)}
    </div>
    </>
  );
}
