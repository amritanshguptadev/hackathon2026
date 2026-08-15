import {useState } from "react";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Upcoming(){
     const [progress, setProgress] = useState(55);

    return (
        <>  
            <Header showSearchBar={false}/>
            <div className="flex items-center justify-center min-h-screen p-4 text-gray-800 bg-[#f8f9fa] font-inter">
                <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 md:p-12 text-center border border-gray-200">
                    <div className="mb-6 mx-auto text-6xl md:text-7xl w-24 h-24 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                    We're Almost There!
                    </h1>
                    <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto">
                    This exciting new feature is currently in development. I appreciate your patience and can't wait to share it with you.
                    </p>
                    <div className="mb-8">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1B6392] rounded-full transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Expected launch date: Jan 2026</p>
                    </div>
                    <Link to="/" className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-950 transition-all duration-200 transform hover:-translate-y-1">Back to Homepage
                    </Link>
                    <div className="mt-10 pt-6 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Stay Up-to-Date</h2>
                    <form className="flex flex-col sm:flex-row justify-center gap-4" onSubmit={(e) => e.preventDefault()}>
                        <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full sm:w-2/3 p-3 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200" 
                        required 
                        />
                        <button 
                        type="submit" 
                        className="w-full sm:w-1/3 bg-[#1B6392] text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition-colors duration-200"
                        >
                        Notify Me
                        </button>
                    </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
  );
}