import React, { useEffect, useRef, useState } from "react";
import { FaStore, FaImage, FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetMyShop from "../hooks/useGetMyShop";
import { setMyShopData } from "../redux/OwnerSlice";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetMyShop();

  const { MyshopData } = useSelector((state) => state.owner);
  const {
    city: currentCity,
    state: currentState,
    address: currentAddress,
  } = useSelector((state) => state.user);

  const [shopName, setShopName] = useState("");
  const [shopCity, setShopCity] = useState("");
  const [shopState, setShopState] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [localPreview, setLocalPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);

  const isEditing = Boolean(MyshopData);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (MyshopData) {
      setShopName(MyshopData.name || "");
      setShopCity(MyshopData.city || currentCity || "");
      setShopState(MyshopData.state || currentState || "");
      setShopAddress(MyshopData.address || currentAddress || "");
      setLocalPreview("");
      setShopImage(null);
      hasInitialized.current = true;
      return;
    }

    if (hasInitialized.current) {
      return;
    }

    if (!currentCity && !currentState && !currentAddress) {
      return;
    }

    setShopName("");
    setShopCity(currentCity || "");
    setShopState(currentState || "");
    setShopAddress(currentAddress || "");
    setLocalPreview("");
    setShopImage(null);
    hasInitialized.current = true;
  }, [MyshopData, currentCity, currentState, currentAddress]);

  useEffect(() => {
    if (!shopImage) {
      setLocalPreview("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(shopImage);
    setLocalPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [shopImage]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !shopName.trim() ||
      !shopCity.trim() ||
      !shopState.trim() ||
      !shopAddress.trim()
    ) {
      toast.error("Please fill in all shop details");
      return;
    }

    if (!shopImage && !MyshopData?.image) {
      toast.error("Please add a shop image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", shopName.trim());
      formData.append("city", shopCity.trim());
      formData.append("state", shopState.trim());
      formData.append("address", shopAddress.trim());

      if (shopImage) {
        formData.append("image", shopImage);
      }

      console.log(serverUrl);
      const res = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      dispatch(setMyShopData(res.data));
      toast.success(
        isEditing ? "Shop updated successfully!" : "Shop created successfully!",
      );
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const imagePreview = localPreview || MyshopData?.image || "";

  return (
    <div className="min-h-screen bg-[#fff9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-[#ff4d2d]/10 bg-white shadow-[0_20px_60px_rgba(255,77,45,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-between bg-gradient-to-br from-[#fff9f6] via-white to-[#fff1eb] p-6 sm:p-8 lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ff4d2d]/10 px-4 py-2 text-sm font-semibold text-[#ff4d2d]">
                <FaStore />
                {isEditing ? "Edit Shop" : "Add Shop"}
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {isEditing ? "Update your shop" : "Add Shop"}
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-gray-600 sm:text-base">
                Keep your shop details clean and easy to scan. The layout stays
                simple, but the spacing, focus states, and responsiveness are
                tuned for a much better experience.
              </p>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur-sm">
                <div className="font-semibold text-gray-900">Clean layout</div>
                <div className="mt-1">
                  Balanced spacing for mobile and desktop.
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur-sm">
                <div className="font-semibold text-gray-900">
                  Responsive form
                </div>
                <div className="mt-1">
                  Fields stack naturally on smaller screens.
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 p-6 sm:p-8 lg:p-10"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter Shop Name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff4d2d] focus:ring-4 focus:ring-[#ff4d2d]/10"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaImage className="text-[#ff4d2d]" />
                Shop Image
              </label>
              <label className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-gray-300 bg-[#fff9f6] p-4 transition hover:border-[#ff4d2d] hover:bg-[#fff4ef]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setShopImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
                    <FaImage />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800">
                      Choose shop image
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {shopImage?.name ||
                        (MyshopData?.image
                          ? "Current image loaded"
                          : "No file chosen")}
                    </div>
                  </div>
                </div>
              </label>

              {imagePreview ? (
                <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Shop preview"
                    className="h-40 w-full object-cover sm:h-48"
                  />
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  value={shopCity}
                  onChange={(e) => setShopCity(e.target.value)}
                  placeholder="Enter City"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff4d2d] focus:ring-4 focus:ring-[#ff4d2d]/10"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaLocationDot className="text-[#ff4d2d]" />
                  State
                </label>
                <input
                  value={shopState}
                  onChange={(e) => setShopState(e.target.value)}
                  placeholder="Enter State"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff4d2d] focus:ring-4 focus:ring-[#ff4d2d]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                placeholder="Enter Shop Address"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff4d2d] focus:ring-4 focus:ring-[#ff4d2d]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff4d2d] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff4d2d]/20 transition hover:bg-[#e64323] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <ClipLoader size={18} color="#ffffff" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? "Update Shop" : "Save"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditShop;
