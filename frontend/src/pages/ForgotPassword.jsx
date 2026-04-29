import React, { useState, useRef, useEffect } from 'react'
import { FaRegEye, FaRegEyeSlash, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'


// ============================================================
// Brand colors — matches SignIn/SignUp theme
// ============================================================
const primaryColor = "#ff4d2d"
const hoverColor = "#e64323"
const bgColor = "#fff9f6"
const inputClassName = "peer w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-md text-gray-900 transition-all duration-200 placeholder:text-transparent focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]/15"
const floatingLabelClassName = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-md text-gray-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-[var(--primary-color)] peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-[var(--primary-color)]"

const FloatingInput = ({ id, type = "text", value, onChange, label, autoFocus = false, className = "", inputStyle, trailingContent }) => (
    <div className="relative" style={{ "--primary-color": primaryColor }}>
        <input
            className={`${inputClassName} ${className}`}
            style={inputStyle}
            type={type}
            id={id}
            placeholder=" "
            value={value}
            onChange={onChange}
            autoFocus={autoFocus}
        />
        <label htmlFor={id} className={floatingLabelClassName}>
            {label}
        </label>
        {trailingContent}
    </div>
)

// ============================================================
// Step 1: Email Input
// ============================================================
const EmailStep = ({ email, setEmail, onSubmit, loading }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) return toast.error("Email is required")
        if (!emailRegex.test(email)) return toast.error("Please enter a valid email")
        onSubmit()
    }

    return (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#fff0ec' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={primaryColor} strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Forgot Password?</h2>
                <p className="text-gray-500 text-sm mt-1">Enter your email and we'll send you an OTP to reset your password.</p>
            </div>

            <div>
                <FloatingInput
                    id="forgot-email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                />
            </div>

            <button type="submit" disabled={loading}
                className="w-full text-white p-2.5 rounded-lg transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: loading ? hoverColor : primaryColor }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = hoverColor)}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = primaryColor)}>
                {loading ? (
                    <>
                        <ClipLoader size={18} color="#ffffff" />
                        <span>Sending OTP...</span>
                    </>
                ) : "Send OTP"}
            </button>
        </form>
    )
}

// ============================================================
// Step 2: OTP Verification
// ============================================================
const OtpStep = ({ email, onSubmit, onResend, loading }) => {
    const [otp, setOtp] = useState(Array(6).fill(""))
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef([])

    // Countdown timer for resend
    useEffect(() => {
        if (timer <= 0) { setCanResend(true); return }
        const interval = setInterval(() => setTimer((t) => t - 1), 1000)
        return () => clearInterval(interval)
    }, [timer])

    // Handle single digit input with auto-advance
    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return // Only allow digits
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        if (value && index < 5) inputRefs.current[index + 1]?.focus()
    }

    // Handle backspace navigation
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    // Handle paste — distribute digits across boxes
    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (!pasted) return
        const newOtp = Array(6).fill("")
        pasted.split("").forEach((char, i) => { newOtp[i] = char })
        setOtp(newOtp)
        inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const otpString = otp.join("")
        if (otpString.length !== 6) return toast.error("Please enter the complete 6-digit OTP")
        onSubmit(otpString)
    }

    const handleResend = () => {
        setCanResend(false)
        setTimer(60)
        setOtp(Array(6).fill(""))
        onResend()
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#fff0ec' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={primaryColor} strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Enter OTP</h2>
                <p className="text-gray-500 text-sm mt-1">We sent a 6-digit code to <strong className="text-gray-700">{email}</strong></p>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                    <input key={i} ref={(el) => (inputRefs.current[i] = el)}
                        type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-colors"
                        style={{ borderColor: digit ? primaryColor : '#e5e7eb', color: primaryColor }}
                        autoFocus={i === 0}
                        aria-label={`OTP digit ${i + 1}`}
                    />
                ))}
            </div>

            {/* Resend timer */}
            <div className="text-center text-sm">
                {canResend ? (
                    <button type="button" onClick={handleResend} className="font-medium hover:underline cursor-pointer" style={{ color: primaryColor }}>
                        Resend OTP
                    </button>
                ) : (
                    <span className="text-gray-500">Resend OTP in <strong style={{ color: primaryColor }}>{timer}s</strong></span>
                )}
            </div>

            <button type="submit" disabled={loading}
                className="w-full text-white p-2.5 rounded-lg transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: loading ? hoverColor : primaryColor }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = hoverColor)}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = primaryColor)}>
                {loading ? (
                    <>
                        <ClipLoader size={18} color="#ffffff" />
                        <span>Verifying...</span>
                    </>
                ) : "Verify OTP"}
            </button>
        </form>
    )
}

// ============================================================
// Step 3: Reset Password
// ============================================================
const ResetStep = ({ onSubmit, loading }) => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Password strength calculator
    const getStrength = (pwd) => {
        let score = 0
        if (pwd.length >= 8) score++
        if (/[A-Z]/.test(pwd)) score++
        if (/[a-z]/.test(pwd)) score++
        if (/\d/.test(pwd)) score++
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++
        return score
    }

    const strength = getStrength(password)
    const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"]
    const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"]
    const strengthWidths = ["0%", "20%", "40%", "60%", "80%", "100%"]

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!password) return toast.error("Password is required")
        if (password.length < 8) return toast.error("Password must be at least 8 characters")
        if (strength < 3) return toast.error("Please choose a stronger password")
        if (password !== confirmPassword) return toast.error("Passwords do not match")
        onSubmit(password)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#fff0ec' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={primaryColor} strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Set New Password</h2>
                <p className="text-gray-500 text-sm mt-1">Create a strong password for your account.</p>
            </div>

            {/* New Password */}
            <div>
                <FloatingInput
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    className="pr-10"
                    inputStyle={{ paddingRight: "2.75rem" }}
                    trailingContent={(
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-(--primary-color)">
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    )}
                />
                {/* Strength indicator */}
                {password && (
                    <div className="mt-2">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: strengthWidths[strength], backgroundColor: strengthColors[strength] }} />
                        </div>
                        <p className="text-xs mt-1 font-medium" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
                    </div>
                )}
                <ul className="text-xs text-gray-400 mt-2 space-y-0.5 pl-1">
                    <li className={password.length >= 8 ? "text-green-500" : ""}>• At least 8 characters</li>
                    <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>• One uppercase letter</li>
                    <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>• One lowercase letter</li>
                    <li className={/\d/.test(password) ? "text-green-500" : ""}>• One number</li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : ""}>• One special character</li>
                </ul>
            </div>

            {/* Confirm Password */}
            <div>
                <FloatingInput
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    inputStyle={{ paddingRight: "2.75rem" }}
                    trailingContent={(
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-(--primary-color)">
                            {showConfirm ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    )}
                />
                {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
                {confirmPassword && password === confirmPassword && (
                    <p className="text-xs text-green-500 mt-1">Passwords match ✓</p>
                )}
            </div>

            <button type="submit" disabled={loading}
                className="w-full text-white p-2.5 rounded-lg transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: loading ? hoverColor : primaryColor }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = hoverColor)}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = primaryColor)}>
                {loading ? (
                    <>
                        <ClipLoader size={18} color="#ffffff" />
                        <span>Resetting...</span>
                    </>
                ) : "Reset Password"}
            </button>
        </form>
    )
}

// ============================================================
// Step 4: Success Screen
// ============================================================
const SuccessStep = ({ navigate }) => {
    const [countdown, setCountdown] = useState(3)

    useEffect(() => {
        if (countdown <= 0) { navigate("/signIn"); return }
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown, navigate])

    return (
        <div className="flex flex-col items-center gap-4 py-4">
            {/* Animated checkmark */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-bounce" style={{ backgroundColor: '#f0fdf4' }}>
                <FaCheckCircle className="text-5xl text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Password Reset Successfully!</h2>
            <p className="text-gray-500 text-sm text-center">Your password has been updated. You can now sign in with your new password.</p>
            <p className="text-sm text-gray-400">Redirecting in <strong style={{ color: primaryColor }}>{countdown}s</strong></p>
            <button onClick={() => navigate("/signIn")}
                className="w-full text-white p-2.5 rounded-lg transition-colors cursor-pointer font-medium"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = hoverColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = primaryColor)}>
                Go to Sign In
            </button>
        </div>
    )
}

// ============================================================
// Main ForgotPassword Component — Multi-step Controller
// ============================================================
const ForgotPassword = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)        // Current step (1-4)
    const [email, setEmail] = useState("")      // Email entered in step 1
    const [resetToken, setResetToken] = useState("") // Token from OTP verification
    const [loading, setLoading] = useState(false)

    // Step indicator labels
    const steps = ["Email", "Verify", "Reset", "Done"]

    // --- Step 1: Send OTP ---
    const handleSendOtp = async () => {
        try {
            setLoading(true)
            await axios.post(`${serverUrl}/api/auth/forgot-password`, { email })
            toast.success("OTP sent to your email!")
            setStep(2)
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP")
        } finally {
            setLoading(false)
        }
    }

    // --- Step 2: Verify OTP ---
    const handleVerifyOtp = async (otp) => {
        try {
            setLoading(true)
            const res = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp })
            setResetToken(res.data.resetToken)
            toast.success("OTP verified!")
            setStep(3)
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP")
        } finally {
            setLoading(false)
        }
    }

    // --- Step 2b: Resend OTP ---
    const handleResendOtp = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/forgot-password`, { email })
            toast.success("New OTP sent!")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP")
        }
    }

    // --- Step 3: Reset Password ---
    const handleResetPassword = async (newPassword) => {
        try {
            setLoading(true)
            await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword })
            toast.success("Password reset successfully!")
            setStep(4)
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: bgColor }}>
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-orange-200 flex flex-col gap-4">
                {/* Header with back button */}
                <div className="flex items-center gap-3 mb-1">
                    {step < 4 && (
                        <button onClick={() => step === 1 ? navigate("/signIn") : setStep(step - 1)}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" aria-label="Go back">
                            <FaArrowLeft />
                        </button>
                    )}
                    <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>FoodBit</h1>
                </div>

                {/* Step Progress Indicator */}
                {step < 4 && (
                    <div className="flex items-center gap-1 mb-2">
                        {steps.map((label, i) => (
                            <React.Fragment key={label}>
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i + 1 <= step ? 'text-white' : 'text-gray-400 border-2 border-gray-200'}`}
                                        style={i + 1 <= step ? { backgroundColor: primaryColor } : {}}>
                                        {i + 1 < step ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-xs mt-1 ${i + 1 <= step ? 'font-medium text-gray-700' : 'text-gray-400'}`}>{label}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="flex-1 h-0.5 mb-5 rounded-full transition-all duration-300" style={{ backgroundColor: i + 1 < step ? primaryColor : '#e5e7eb' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {/* Render current step */}
                {step === 1 && <EmailStep email={email} setEmail={setEmail} onSubmit={handleSendOtp} loading={loading} />}
                {step === 2 && <OtpStep email={email} onSubmit={handleVerifyOtp} onResend={handleResendOtp} loading={loading} />}
                {step === 3 && <ResetStep onSubmit={handleResetPassword} loading={loading} />}
                {step === 4 && <SuccessStep navigate={navigate} />}

                {/* Back to sign in link (steps 1-3) */}
                {step < 4 && (
                    <p className="text-center text-sm text-gray-500">
                        Remember your password?{' '}
                        <span className="hover:underline cursor-pointer font-medium" style={{ color: primaryColor }} onClick={() => navigate("/signIn")}>
                            Sign In
                        </span>
                    </p>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
