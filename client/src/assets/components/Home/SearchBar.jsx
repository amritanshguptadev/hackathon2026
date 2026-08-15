import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBar({ searchText, onChange,}) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate(); 
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
  
  const handleSearch = () => {
    if (selectedCategory) {
      navigate(`/category/${selectedCategory.toLowerCase()}`);
      
    } else {
      console.log('No category selected');
    }
    // Later: i have to add backend call here using fetch or axios
    //fetch(`/api/search?query=${searchText}&category=${selectedCategory}`)
  };

  return (
    <div className="flex items-center h-12 w-full bg-white border border-gray-300 px-3 py-2 rounded-full shadow-sm overflow-hidden my-2 md:ml-20">
  <>
    <select
      className="text-sm bg-transparent pr-2 focus:outline-none whitespace-nowrap"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option>Category</option>
      {categories.map((category, index) => (
        <option key={index}>{category.name}</option>
      ))}
    </select>

    <div className="w-px h-6 bg-gray-300 mx-2" />
  </>

  <input
    type="text"
    placeholder="Search for anything..."
    value={searchText}
    onChange={onChange}
    className="truncate flex-grow min-w-0 py-1 text-gray-700 bg-transparent focus:outline-none"
  />

  <button
    onClick={handleSearch}
    type="button"
    className="text-gray-500 hover:text-black flex-shrink-0"
  >
    <Search size={22} />
  </button>
</div>

  );
}
