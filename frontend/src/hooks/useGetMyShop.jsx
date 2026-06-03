import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/OwnerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/my-shop`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.log(`error in fetching shop data :${error}`);
      }
    };

    fetchShop();
  }, []);
};

export default useGetMyShop;
