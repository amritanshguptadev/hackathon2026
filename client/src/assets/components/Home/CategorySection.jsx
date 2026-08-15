import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategorySection() {
  const scrollRef = useRef(null);
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

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative md:m-10 pb-10">
      <div className="raleway font-bold text-xl md:text-4xl text-black  flex justify-center my-6">
        Shop with Category
      </div>

      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 shadow-md rounded-full md:p-2 z-10 hover:bg-orange-600"
        onClick={() => scroll("left")}
      >
        <ArrowLeft color="white" />
      </button>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 shadow-md rounded-full md:p-2 z-10 hover:bg-orange-600"
        onClick={() => scroll("right")}
      >
        <ArrowRight color="white" />
      </button>

      <div className="flex justify-center">
        <div
          ref={scrollRef}
          className="overflow-x-auto flex snap-x snap-mandatory space-x-4 px-4"
        >
          {categories.map((item, index) => (
            <Link
              key={index}
              to={`upcoming`}
              className=" w-30 h-40 md:w-56 md:h-52 border border-gray-300 rounded-md snap-center raleway text-lg font-medium shrink-0 text-center flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-25 mb-2 object-contain"
              />
              <p className="mt-4 md:text-xl">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
