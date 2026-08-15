// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../../../utils'
import Footer from '../Home/Footer'
import HeaderMain from '../Home/HeaderMain'

export default function LoginForm() {
  const [loginInfo,setLoginInfo] = useState({
            email:'',
            password:''
        })
    const navigate = useNavigate();

    const handleChange = (e)=>{
        const {name,value} = e.target;
        console.log(name,value);
        const copyloginInfo = { ...loginInfo};
        copyloginInfo[name] = value;
        setLoginInfo(copyloginInfo);
    }

    const handleLogin = async (e)=>{
        e.preventDefault();
        const {email,password} = loginInfo;

        // Client side
        if(!email || !password){
            return handleError("All fields are required")
        }

        // server side 
        try{
            const url = 'http://localhost:3000/api/auth/login';
            const response = await fetch(url,{
                method:'post',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const {success,message,error,jwtToken,name} = result;
            if(success){
                handleSuccess(message);
                localStorage.setItem('token',jwtToken);
                localStorage.setItem('loggedInUser',name)
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else if(error){
                const details = error?.details[0].message;
                handleError(details) 
            } else if(!success){
                handleError(message)
            }
            
            console.log(result)
        }

        catch(error){
            handleError(error)
        }
         
    };

  return (
    <>
    <HeaderMain/>
      <div className="flex flex-col md:flex-row w-full ">
      <div className="raleway w-full md:w-2/4 flex justify-center py-10 px-10 md:py-20">
        <div className="w-full rounded-xl shadow-2xl p-5 md:p-15 py-10">
          <div className="pb-6 md:pb-10">
            <h1 className="text-2xl md:text-3xl font-black py-3">Login to your account</h1>
            <p className="text-base md:text-lg text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4 text-black">
                Create now
              </Link>
            </p>
          </div>

          <form className="w-full" onSubmit={handleLogin}>
            <div className="w-full my-1 md:my-2">
              <label htmlFor="email" className="block text-base md:text-xl font-bold text-[#1E1E1E]">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={loginInfo.email}
                onChange={handleChange}
                placeholder="abc@gmail.com"
                className="text-base md:text-lg border-2 border-gray-500 w-full h-10 md:h-12 my-2 px-4 rounded-md focus:outline-none focus:border-[#1B6392]"
              />
            </div>
            <div className="w-full my-1 md:my-2">
              <label htmlFor="password" className="block text-base md:text-xl font-bold text-[#1E1E1E]">
                Password
              </label>
              <input
              name="password"
                id="password"
                value={loginInfo.password}
                onChange={handleChange}
                type="password"
                placeholder="abc#123"
                className="text-base md:text-lg border-2 border-gray-500 w-full h-10 md:h-12 my-1 px-4 rounded-md focus:outline-none focus:border-[#1B6392]"
              />
            </div>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-[#1B6392] py-1 md:py-2 border-2 border-[#1B6392] rounded-2xl font-bold md:font-black text-white text-xl md:text-3xl cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-2/4">
        <img
          src="/Login_Signup/login.png"
          alt="Login Visual"
          className="h-screen w-full object-cover"
        />
      </div>
    </div>
    <Footer/>
    <ToastContainer/>
    </>
  );
}
