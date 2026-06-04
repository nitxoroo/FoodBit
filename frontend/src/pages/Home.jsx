import React from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import OwnerDashboard from "../components/OwnerDashboard";

const Home = () => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div>
      {userData?.role === "restaurantPartner" ? <OwnerDashboard /> : <Navbar />}
    </div>
  );
};

export default Home;
