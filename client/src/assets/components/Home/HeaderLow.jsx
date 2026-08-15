import { MapPin, Info, Headphones, Mail } from "lucide-react";
import SearchBar from "./SearchBar";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { categoryService, FALLBACK_CATEGORIES } from "../../../services/categoryService";

export default function HeaderLow({ showSearchBar = true }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getActiveCategories().then((data) => {
      if (data && data.length > 0) setCategories(data);
    });
  }, []);

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val && val !== "Select Category") {
      navigate(`/all-products?category=${encodeURIComponent(val)}`);
    }
  };

  return (
    <>
      <div className="raleway w-full bg-white border-b border-gray-200 text-sm lg:text-md">
      <div className="hidden md:flex justify-between items-center px-4 py-3">
        <div className="flex gap-6 items-center">
          <select
            onChange={handleCategorySelect}
            className="border ml-2 px-2 py-1 rounded text-sm bg-white cursor-pointer"
            defaultValue="Select Category"
          >
            <option value="Select Category">
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category.id || category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <Link to="/upcoming" className="flex items-center gap-1">
            <MapPin size={18} /> Track Order
          </Link>
          <Link to="/sell">Sell</Link>
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
