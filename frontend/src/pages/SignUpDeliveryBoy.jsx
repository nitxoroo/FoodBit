import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUpDeliveryBoy = () => {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ff4d2d";
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e?.preventDefault();

    if (
      !fullname.trim() ||
      !email.trim() ||
      !mobileNumber.trim() ||
      !vehicleType.trim() ||
      !licenseNumber.trim() ||
      !password.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${serverUrl}/api/auth/delivery/signUp`,
        {
          fullname,
          email,
          password,
          mobileNumber,
          vehicleType,
          licenseNumber,
          role: "deliveryPartner",
        },
        { withCredentials: true },
      );

      dispatch(setUserData(res.data));
      toast.success("Delivery partner account created successfully!");
      navigate("/delivery/signIn");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "peer w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-md text-gray-900 transition-all duration-200 placeholder:text-transparent focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]/15";
  const floatingLabelClassName =
    "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-md text-gray-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-[var(--primary-color)] peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-[var(--primary-color)]";

  const renderFloatingInput = ({
    id,
    type = "text",
    value,
    onChange,
    label,
    className = "",
    inputStyle,
    trailingContent,
  }) => (
    <div className="relative" style={{ "--primary-color": primaryColor }}>
      <input
        className={`${inputClassName} ${className}`}
        style={inputStyle}
        type={type}
        id={id}
        placeholder=" "
        value={value}
        onChange={onChange}
      />
      <label htmlFor={id} className={floatingLabelClassName}>
        {label}
      </label>
      {trailingContent}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[${borderColor}] flex flex-col gap-4`}
      >
        <div className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
          Delivery Partner
        </div>
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          FoodBit
        </h1>
        <p>Create your delivery partner account and start accepting orders.</p>

        <div>
          {renderFloatingInput({
            id: "fullname",
            label: "Full Name",
            value: fullname,
            onChange: (e) => setFullName(e.target.value),
          })}
        </div>

        <div>
          {renderFloatingInput({
            id: "email",
            type: "email",
            label: "Email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          })}
        </div>

        <div>
          {renderFloatingInput({
            id: "mobile-number",
            label: "Mobile Number",
            value: mobileNumber,
            onChange: (e) => setMobileNumber(e.target.value),
          })}
        </div>

        <div>
          <select
            id="vehicle-type"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className={inputClassName}
            style={{ "--primary-color": primaryColor }}
          >
            <option value="">Select Vehicle Type</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="car">Car</option>
            <option value="bicycle">Bicycle</option>
          </select>
        </div>

        <div>
          {renderFloatingInput({
            id: "license-number",
            label: "License Number",
            value: licenseNumber,
            onChange: (e) => setLicenseNumber(e.target.value),
          })}
        </div>

        <div>
          {renderFloatingInput({
            id: "password",
            type: showPassword ? "text" : "password",
            label: "Password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "pr-10",
            inputStyle: { paddingRight: "2.75rem" },
            trailingContent: (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-(--primary-color)"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            ),
          })}
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`w-full bg-[#ff4d2d] text-white p-2 rounded-lg transition-colors cursor-pointer hover:bg-[#e64323] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <ClipLoader size={18} color="#ffffff" />
              <span>Signing Up...</span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-center">
          Already have a delivery partner account?{" "}
          <span
            className="text-orange-500 hover:underline cursor-pointer"
            onClick={() => navigate("/delivery/signIn")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpDeliveryBoy;
