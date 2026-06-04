import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa6";
import { TfiReceipt } from "react-icons/tfi";

const Navbar = () => {
  const { userData, city } = useSelector((state) => state.user);
  const { MyshopData } = useSelector((state) => state.owner);
  const isUser = userData?.role === "user";

  const [showProfileInfo, SetshowProfileInfo] = useState(false);
  const dispatch = useDispatch();
  const [showSearch, setshowSearch] = useState(false);
  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(`error in logging out :${error}`);
    }
  };
  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-7.5 px-5 fixed top-0 z-9999 bg-[#fff9f6] overflow-visible">
      {isUser && showSearch && (
        <div className=" md:hidden w-[90%] h-17.5  fixed top-20 left-[5%] bg-white shadow-xl rounded-lg flex items-center gap-5">
          <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className=" w-[80%] truncate text-gray-600">{city}</div>
          </div>
          {/* Search Bar */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center flex-1">
              <FiSearch size={25} className="text-[#ff4d2d] flex-shrink-0" />

              <input
                type="text"
                placeholder="Search Delicious Food..."
                className="w-full px-2.5 text-gray-700 outline-none"
              />
            </div>

            <RxCross2
              onClick={() => {
                setshowSearch(false);
              }}
              size={25}
              className="cursor-pointer text-gray-500 hover:text-black mx-2"
            />
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]"> FoodBit</h1>
      {isUser && (
        <div className=" max-md:hidden md:w-[60%] lg:w-[40%] h-17.5 bg-white shadow-xl rounded-lg flex items-center gap-5">
          <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className=" w-[80%] truncate text-gray-600">{city}</div>
          </div>
          {/* Search Bar */}
          <div className="flex items-center">
            <FiSearch size={25} className="text-[#ff4d2d]" />
            <input
              className="px-2.5 text-gray-700 outline-0 w-full"
              type="text"
              placeholder="Search Delicious Food...."
            />
          </div>
        </div>
      )}

      {/* Cart & Profile Icon */}
      <div className="flex items-center gap-4">
        {isUser && (
          <>
            <FiSearch
              onClick={() => setshowSearch(!showSearch)}
              size={25}
              className="text-[#ff4d2d] md:hidden"
            />
            <div className="relative cursor-pointer">
              <FiShoppingCart size={25} className="text-[#ff4d2d]" />
              <span className="absolute -right-2.25 -top-3 text-[#ff4d2d] ">
                0
              </span>
            </div>
          </>
        )}

        <div className="bg-[#ff4d2d]/10 text-[#ff4d2d] px-3 py-1 rounded-lg  cursor-pointer flex items-center gap-1">
          <FaPlus />
          <span className="hidden sm:block">Add Items</span>
        </div>

        {/* My Order Button */}

        <div className=" flex items-center gap-1 px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] relative cursor-pointer">
          <TfiReceipt />
          <span className="hidden sm:block">Pending Orders</span>
          <span className="absolute -right-2 -top-2 text-xs bg-[#ff4d2d] text-white rounded-full px-1.5 py-px">
            0
          </span>
        </div>

        {/* Profile Icon */}
        <div
          onClick={() => SetshowProfileInfo(!showProfileInfo)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
        >
          {userData?.fullname.slice(0, 1)}
        </div>

        {/* drop Down Box on Profile */}
        {showProfileInfo && (
          <div className="fixed top-20 right-2.5 md:right-[1000%] lg:right-[25%] w-45 bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
            <div className="text-[17px] font-semibold">
              {userData?.fullname}
            </div>
            <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
              My Orders
            </div>
            <div
              onClick={handleLogOut}
              className="text-[#ff4d2d] font-semibold cursor-pointer"
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
