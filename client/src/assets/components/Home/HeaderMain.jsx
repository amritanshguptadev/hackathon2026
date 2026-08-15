import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import SearchBar from "./SearchBar.jsx";
import MobileMenu from "./MobileMenu.jsx";
import "../../Styles/Header.css";
import { Link } from "react-router-dom";

export default function HeaderMain({ showSearchBar = true }) {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const userName = localStorage.getItem("loggedInUser");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchText);
  };

  return (
    <div className="bg-[#1B6392] px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link to="/">
          <h3 className="raleway Header-logo text-4xl text-white">STUDx</h3>
        </Link>

        <div className="hidden md:flex items-center w-1/2 ">
          {showSearchBar && (
            <SearchBar
              searchText={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
            />
          )}
        </div>
        {!isAuthenticated ? (
          <div className="hidden sm:flex flex-row sm:space-x-3 sm:space-y-3 sm:space-y-0 rounded-xl ml-0 sm:ml-40">
            <Link
              to="/login"
              className="px-3 py-2 bg-white/90 text-[#1B6392] font-extrabold rounded-xl shadow hover:bg-white transition-all duration-200 text-center"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="p-2 rounded-xl text-white font-bold hover:text-blue-200 hover:underline transition-colors duration-200 text-center"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-3 sm:ml-40 bg-white/10 px-4 py-2 rounded-full shadow-md hover:bg-white/20 transition-all duration-300">
            <Link to="/profile" className="flex items-center gap-2">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName
                )}&background=1B6392&color=fff&rounded=true&size=40`}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-white shadow-sm"
              />
              <span className="text-white font-semibold tracking-wide hover:text-gray-200 transition-colors duration-200">
                {userName}
              </span>
            </Link>
          </div>
        )}

        <div className="hidden md:flex items-center gap-5 ">
          <Link to="/upcoming" className="text-white hover:text-gray-300">
            <ShoppingCart size={28} />
          </Link>
          <Link to="/upcoming" className="text-white hover:text-gray-300">
            <Heart size={28} />
          </Link>
          <Link to="/profile" className="text-white hover:text-gray-300">
            <User size={28} />
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {menuOpen && <MobileMenu /> }
    </div>
  );
}
