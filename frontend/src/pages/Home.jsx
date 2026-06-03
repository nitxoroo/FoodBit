import React from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  console.log("userData:", userData);
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Home;
