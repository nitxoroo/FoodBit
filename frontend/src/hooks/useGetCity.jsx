import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setState, setCity, setUserData, setAddress } from "../redux/userSlice";
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
      console.log(result);
      console.log(result.data.features[0].properties.city);
      console.log(result.data.features[0].properties.state);
      console.log(result.data.features[0].properties.address_line2);
      dispatch(setCity(result.data.features[0].properties.city));
      dispatch(setState(result.data.features[0].properties.state));
      dispatch(setAddress(result.data.features[0].properties.address_line2));
    });
  }, [userData]);
};

export default useGetCity;
