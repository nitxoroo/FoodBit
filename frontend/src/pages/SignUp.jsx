import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ff4d2d";
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSingUp = async (e) => {
    e?.preventDefault();

    // Client-side validation — prevent sending empty fields
    if (
      !fullname.trim() ||
      !email.trim() ||
      !password.trim() ||
      !mobileNumber.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${serverUrl}/api/auth/signUp`,
        {
          fullname,
          email,
          password,
          mobileNumber,
        },
        { withCredentials: true },
      );

      dispatch(setUserData(res.data.user));
      toast.success("Account created successfully!");
      navigate("/signIn");
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSingUp(e);
          }
        }}
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
        className={`bg-white rounded-xl shadow-lg w-ful max-w-md p-8 border border-[${borderColor}] flex flex-col gap-4`}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          FoodBit
        </h1>
        <p>Create your account to get started with delicious food! </p>

        {/* FullName */}
        <div>
          {renderFloatingInput({
            id: "fullname",
            label: "Full Name",
            value: fullname,
            onChange: (e) => setFullName(e.target.value),
          })}
        </div>

        {/* Email */}
        <div>
          {renderFloatingInput({
            id: "email",
            type: "email",
            label: "Email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          })}
        </div>

        {/* Password */}
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

        {/* Mobile Number */}
        <div>
          {renderFloatingInput({
            id: "mobileNumber",
            label: "Mobile Number",
            value: mobileNumber,
            onChange: (e) => setMobileNumber(e.target.value),
          })}
        </div>

        <button
          onClick={handleSingUp}
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
          Already have an account?{" "}
          <span
            className="text-orange-500 hover:underline cursor-pointer"
            onClick={() => navigate("/signIn")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
