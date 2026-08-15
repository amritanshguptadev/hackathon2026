import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { UserRound, AlertCircle } from "lucide-react";
import HeaderMain from "../assets/components/Home/HeaderMain";
import HeaderLow from "../assets/components/Home/HeaderLow";
import { Link, useNavigate } from "react-router-dom";

export default function Profile({setIsAuthenticated}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let delayTimer;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleError("You are not logged in");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:3000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await res.json();
         if (res.ok) {
            setProfile(data);
          } 
    }
      catch (err) {
        handleError("Error fetching profile: " + err.message);
        setLoading(false);
      }
    };

    fetchProfile();
    return () => clearTimeout(delayTimer);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  // if (loading) {
  //   return (
  //     <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 p-6 md:p-8 max-w-lg mx-auto animate-pulse">
  //       <HeaderMain/>
  //       <HeaderLow/>
  //       <div className="space-y-6">
  //         <div>
  //           <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
  //           <div className="h-6 bg-gray-300 rounded w-full"></div>
  //         </div>
  //         <div>
  //           <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
  //           <div className="h-6 bg-gray-300 rounded w-full"></div>
  //         </div>
  //         <div>
  //           <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
  //           <div className="h-6 bg-gray-300 rounded w-1/2"></div>
  //         </div>
  //       </div>
  //       <Footer/>
  //     </div>
  //   );
  // }

  if (!profile) {
    return (
      <>
      <HeaderMain/>
      <HeaderLow />
        <div className="flex justify-center p-4 text-gray-800 bg-[#f8f9fa] font-inter">
  <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-3 md:p-6 text-center border border-gray-200">
          <div className="mb-6 mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 text-red-600 shadow-inner">
            <AlertCircle className="h-14 w-14 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            No Profile Data Found
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto">
            We couldn’t find your profile information. Please log in or create an account to access your personalized dashboard.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/signup"
              className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="w-full md:w-auto bg-gray-900 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-950 transition-all duration-200 transform hover:-translate-y-1"
            >
              Log In
            </Link>
          </div>
          <Link
            to="/"
            className="mt-6 inline-block text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
      <Footer/>
      </>
    );
  }
  return (
    <>
      <Header showSearchBar={true} />
      <div className="flex justify-center p-4 text-gray-800 bg-[#f8f9fa] font-inter">
  <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-3 md:p-6 text-center border border-gray-200">
          <div className="mb-6 mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-inner">
            <UserRound className="h-14 w-14 text-blue-700" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Welcome {profile?.name || "User"}
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto">
            We’re glad to have you here! Your presence makes our community better.
          </p>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-left max-w-md mx-auto space-y-5">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.name || "N/A"}
                {profile?.isVerified && (
                  <span className="ml-2 text-green-600 text-sm font-medium">✔ Verified</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900 break-all">
                {profile?.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Joined</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Membership</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.membership || "Basic Member"}
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="mt-8 inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-950 transition-all duration-200 transform hover:-translate-y-1"
          >
            Back to Homepage
          </Link>
          <button
            onClick={handleLogout}
            className="mt-4 inline-block bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:-translate-y-1 ml-5"
          >
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
