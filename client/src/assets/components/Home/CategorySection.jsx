import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const QUICK_CATEGORY_PILLS = [
  "Cars",
  "Motorcycles",
  "Mobile Phones",
  "For Sale: Houses & Apartments",
  "For Rent: Houses & Apartments",
  "Beds-Wardrobes",
  "TVs, Video - Audio",
];

const CATEGORIES_DATA = {
  col1: [
    {
      title: "Cars",
      icon: "🚗",
      items: [],
    },
    {
      title: "Bikes",
      icon: "🏍️",
      items: ["Motorcycles", "Scooters", "Spare Parts", "Bicycles"],
    },
    {
      title: "Properties",
      icon: "🏢",
      items: [
        "For Sale: Houses & Apartments",
        "For Rent: Houses & Apartments",
        "Lands & Plots",
        "For Sale: New Projects & Properties",
        "For Rent: Shops & Offices",
        "For Sale: Shops & Offices",
        "PG & Guest Houses",
      ],
    },
    {
      title: "Electronics & Appliances",
      icon: "🖥️",
      items: [
        "TVs, Video - Audio",
        "Kitchen & Other Appliances",
        "Computers & Laptops",
        "Cameras & Lenses",
        "Games & Entertainment",
        "Fridges",
        "Computer Accessories",
        "Hard Disks, Printers & Monitors",
        "ACs",
        "Washing Machines",
      ],
    },
  ],
  col2: [
    {
      title: "Mobiles",
      icon: "📱",
      items: ["Mobile Phones", "Accessories", "Tablets"],
    },
    {
      title: "Commercial Vehicles & Spares",
      icon: "🛺",
      items: ["Commercial & Other Vehicles", "Spare Parts"],
    },
    {
      title: "Jobs",
      icon: "💼",
      items: [
        "Data entry & Back office",
        "Sales & Marketing",
        "BPO & Telecaller",
        "Driver",
        "Office Assistant",
        "Delivery & Collection",
        "Teacher",
        "Cook",
        "Receptionist & Front office",
        "Operator & Technician",
        "IT Engineer & Developer",
        "Hotel & Travel Executive",
        "Accountant",
        "Warehouse Staff",
        "Designer",
        "Security Guards",
        "Other Jobs",
      ],
    },
  ],
  col3: [
    {
      title: "Furniture",
      icon: "🛋️",
      items: [
        "Sofa & Dining",
        "Beds & Wardrobes",
        "Home Decor & Garden",
        "Kids Furniture",
        "Other Household Items",
      ],
    },
    {
      title: "Fashion",
      icon: "👕",
      items: ["Men", "Women", "Kids"],
    },
    {
      title: "Pets",
      icon: "🐶",
      items: [
        "Fishes & Aquarium",
        "Pet Food & Accessories",
        "Dogs",
        "Other Pets",
      ],
    },
  ],
  col4: [
    {
      title: "Books, Sports & Hobbies",
      icon: "🎸",
      items: [
        "Books",
        "Gym & Fitness",
        "Musical Instruments",
        "Sports Equipment",
        "Other Hobbies",
      ],
    },
    {
      title: "Services",
      icon: "🛠️",
      items: [
        "Education & Classes",
        "Tours & Travel",
        "Electronics Repair & Services",
        "Health & Beauty",
        "Home Renovation & Repair",
        "Cleaning & Pest Control",
        "Legal & Documentation Services",
        "Packers & Movers",
        "Other Services",
      ],
    },
  ],
};

export default function CategorySection() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Dynamic formatted date
  const todayDateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCategoryClick = (catName) => {
    setIsOpen(false);
    navigate(`/all-products?category=${encodeURIComponent(catName)}`);
  };

  return (
    <section ref={dropdownRef} className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 relative z-30">
      {/* ── TOP HORIZONTAL CATEGORY BAR ── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* ALL CATEGORIES Toggle Button (Closed by default, opens on click) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-[#002f34] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:bg-[#003d44] transition-colors cursor-pointer"
        >
          <Menu size={16} />
          <span>ALL CATEGORIES</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Quick Category Horizontal Pills */}
        {QUICK_CATEGORY_PILLS.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => handleCategoryClick(pill)}
            className="shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition cursor-pointer whitespace-nowrap"
          >
            {pill}
          </button>
        ))}

        {/* Dynamic Date Tag */}
        <div className="shrink-0 ml-auto hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400 pl-2 border-l border-slate-200">
          <span>{todayDateStr}</span>
        </div>
      </div>

      {/* ── MEGA-MENU DROPDOWN CLASSIFIEDS GRID (Opens strictly on click) ── */}
      {isOpen && (
        <div className="mt-2 rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8 animate-fade-in transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* COLUMN 1 */}
            <div className="space-y-6">
              {CATEGORIES_DATA.col1.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.title)}
                    className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.title}</span>
                  </button>

                  {cat.items.length > 0 && (
                    <ul className="space-y-1.5 pl-6 text-xs text-slate-600">
                      {cat.items.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(sub)}
                            className="hover:text-indigo-600 hover:underline transition-colors block py-0.5 text-left cursor-pointer"
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* COLUMN 2 */}
            <div className="space-y-6">
              {CATEGORIES_DATA.col2.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.title)}
                    className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.title}</span>
                  </button>

                  {cat.items.length > 0 && (
                    <ul className="space-y-1.5 pl-6 text-xs text-slate-600">
                      {cat.items.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(sub)}
                            className="hover:text-indigo-600 hover:underline transition-colors block py-0.5 text-left cursor-pointer"
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* COLUMN 3 */}
            <div className="space-y-6">
              {CATEGORIES_DATA.col3.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.title)}
                    className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.title}</span>
                  </button>

                  {cat.items.length > 0 && (
                    <ul className="space-y-1.5 pl-6 text-xs text-slate-600">
                      {cat.items.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(sub)}
                            className="hover:text-indigo-600 hover:underline transition-colors block py-0.5 text-left cursor-pointer"
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* COLUMN 4 */}
            <div className="space-y-6">
              {CATEGORIES_DATA.col4.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.title)}
                    className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.title}</span>
                  </button>

                  {cat.items.length > 0 && (
                    <ul className="space-y-1.5 pl-6 text-xs text-slate-600">
                      {cat.items.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(sub)}
                            className="hover:text-indigo-600 hover:underline transition-colors block py-0.5 text-left cursor-pointer"
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
