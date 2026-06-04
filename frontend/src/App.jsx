import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUpPartner from "./pages/SignUpPartner.jsx";
import SignInPartner from "./pages/SignInPartner.jsx";
import SignUpDeliveryBoy from "./pages/SignUpDeliveryBoy.jsx";
import SignInDeliveryBoy from "./pages/SignInDeliveryBoy.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGetCurrUser from "./hooks/useGetCurrUser.jsx";
import { useSelector } from "react-redux";
import useGetCity from "./hooks/useGetCity.jsx";
import CreateEditShop from "./pages/CreateEditShop.jsx";

export const serverUrl = "http://localhost:3000";

const App = () => {
  useGetCurrUser();
  useGetCity();
  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/signIn" />}
        />

        <Route
          path="/signUp"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/signIn"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />

        <Route
          path="/partner/signUp"
          element={!userData ? <SignUpPartner /> : <Navigate to="/" />}
        />

        <Route
          path="/partner/signIn"
          element={!userData ? <SignInPartner /> : <Navigate to="/" />}
        />

        <Route
          path="/delivery/signUp"
          element={!userData ? <SignUpDeliveryBoy /> : <Navigate to="/" />}
        />

        <Route
          path="/delivery/signIn"
          element={!userData ? <SignInDeliveryBoy /> : <Navigate to="/" />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/Create-Edit-Shop" element={<CreateEditShop />} />
      </Routes>
    </>
  );
};

export default App;
