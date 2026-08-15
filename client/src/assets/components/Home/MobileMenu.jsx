import { ShoppingCart, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function MobileMenu({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
      !!localStorage.getItem("token")
    );
  const userName = localStorage.getItem("loggedInUser") || "Guest";

  return (
    <>
      {isAuthenticated && (<div className="flex justify-end mt-4">
        <div className="flex justify-end gap-3 bg-white/10 px-4 py-2 rounded-full shadow-md hover:bg-white/20 transition-all duration-300">
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
      </div>)}

      <div className="md:hidden mt-4 space-y-4">
        {children}
        <div className="flex justify-around text-white">
          <Link to="/upcoming">
            <ShoppingCart size={28} />
          </Link>
          <Link to="/upcoming">
            <Heart size={28} />
          </Link>
          <Link to="/profile">
            <User size={28} />
          </Link>
        </div>
      </div>
    </>
  );
}
