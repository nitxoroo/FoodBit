import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import useGetMyShop from "../hooks/useGetMyShop";

function OwnerDashboard() {
  const { MyshopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  useGetMyShop();

  const showEmptyState = MyshopData === null;

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Navbar />

      <div className="w-full flex-1 flex items-start justify-center px-4 pt-28">
        {showEmptyState ? (
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-[0_18px_50px_rgba(255,77,45,0.12)] border border-[#ff4d2d]/10 px-8 py-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
              <FaUtensils size={40} />
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Add Your Restaurant
            </h2>

            <p className="mt-3 text-lg leading-7 text-gray-500">
              Join our food delivery platform and reach thousands of hungry
              customers every day.
            </p>

            <button
              onClick={() => navigate("/Create-Edit-Shop")}
              className="mt-6 rounded-full bg-[#ff4d2d] px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-[#ff4d2d]/25 transition-transform duration-200 hover:scale-105 hover:bg-[#e64323]"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="w-full max-w-5xl rounded-3xl bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <h2 className="text-3xl font-bold text-gray-800">
              Restaurant Dashboard
            </h2>
            <p className="mt-2 text-gray-500">
              Manage your restaurant, menu, and incoming orders from here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
