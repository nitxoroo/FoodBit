import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setCity, setUserData } from "../redux/userSlice";
import { useSelector } from "react-redux";

const useGetCity = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`,
      );
      // console.log(result);
      console.log(result.data.features[0].properties.city);
      dispatch(setCity(result.data.features[0].properties.city));
    });
  }, [userData]);
};

export default useGetCity;
