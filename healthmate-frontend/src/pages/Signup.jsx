import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthService from "../services/auth.service";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        height: "",
        weight: "",
        activityLevel: "medium",
        healthGoal: "stay fit",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // Username Availability Check
    useEffect(() => {
        setUsernameAvailable(false); // Reset availability on change
        const checkUsername = async () => {
            if (formData.username.length < 3) {
                setUsernameError("");
                return;
            }

            setIsCheckingUsername(true);
            try {
                const response = await AuthService.checkUsername(formData.username);
                if (response.data.message === "Taken") {
                    setUsernameError("Username is already taken");
                    setUsernameAvailable(false);
                } else {
                    setUsernameError(""); // Available
                    setUsernameAvailable(true);
                }
            } catch (err) {
                console.error("Failed to check username", err);
                // Optionally visually indicate that check failed, or just don't say "Available"
                // For now, let's keep it safe. If check fails, we assume we can't guarantee availability.
                // But preventing signup might be annoying if it's just a network blip.
                // Let's just NOT clear the error if it was there? No.
                // Let's set a generic warning or just rely on backend submit check.
                // Better to not show "Available" if we failed.
                setUsernameError("Unable to verify username availability");
                setUsernameAvailable(false);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (formData.username && formData.username.length > 2) {
                checkUsername();
            }
        }, 500); // Debounce for 500ms

        return () => clearTimeout(timeoutId);
    }, [formData.username]);


    // Email Availability Check
    useEffect(() => {
        setEmailAvailable(false); // Reset availability on change
        setEmailVerified(false); // Reset verification if email changes
        setOtpSent(false);
        setOtp("");
        const checkEmail = async () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setEmailError(""); // Clear error if format is invalid
                return;
            }

            setIsCheckingEmail(true);
            try {
                const response = await AuthService.checkEmail(formData.email);
                if (response.data.message === "Taken") {
                    setEmailError("Email is already registered");
                    setEmailAvailable(false);
                } else {
                    setEmailError(""); // Available
                    setEmailAvailable(true);
                }
            } catch (err) {
                console.error("Failed to check email", err);
                setEmailError("Unable to verify email availability");
                setEmailAvailable(false);
            } finally {
                setIsCheckingEmail(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (formData.email && formData.email.includes('@')) {
                checkEmail();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [formData.email]);

    // OTP Logic
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [otpSuccess, setOtpSuccess] = useState("");
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async () => {
        if (!emailAvailable) return;
        setIsSendingOtp(true);
        setOtpError("");
        setOtpSuccess("");
        try {
            await AuthService.sendSignupOtp(formData.email);
            setOtpSent(true);
            setTimer(60);
            setOtpSuccess("OTP sent to your email!");
        } catch (err) {
            setOtpError(err.response?.data?.message || "Failed to send OTP. Please check your email.");
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        setOtpError("");
        setOtpSuccess("");
        try {
            await AuthService.verifyOtp(formData.email, otp);
            setEmailVerified(true);
            setOtpSuccess("Email Verified Successfully!");
            setOtpSent(false); // Hide OTP input
        } catch (err) {
            setOtpError("Invalid OTP. Please try again.");
        }
    };


    const calculateStrength = (pass) => {
        let strength = 0;
        if (pass.length > 5) strength += 20;
        if (pass.match(/[A-Z]/)) strength += 20;
        if (pass.match(/[a-z]/)) strength += 20;
        if (pass.match(/[0-9]/)) strength += 20;
        if (pass.match(/[^A-Za-z0-9]/)) strength += 20;
        setPasswordStrength(strength);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            calculateStrength(value);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (usernameError || emailError) {
            return; // Block submit if username or email is taken
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await register(
                formData.username,
                formData.email,
                formData.password,
                formData.age,
                formData.height,
                formData.weight,
                formData.activityLevel,
                formData.healthGoal
            );
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to register.");
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength < 40) return "#ef4444"; // Red
        if (passwordStrength < 80) return "#eab308"; // Yellow
        return "#22c55e"; // Green
    };

    const passwordsMatch = formData.password === formData.confirmPassword;
    const showMatchError = formData.confirmPassword.length > 0 && !passwordsMatch;

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "80px",
            paddingBottom: "40px"
        }}>
            <div className="glass-card" style={{ maxWidth: "600px", margin: "0" }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem', fontWeight: '700' }}>Create Account</h2>
                {error && <div style={{ color: "#ef4444", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            onChange={handleChange}
                            style={{ borderColor: usernameError ? '#ef4444' : (usernameAvailable ? '#22c55e' : '') }}
                            required
                        />
                        {isCheckingUsername && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Checking availability...</p>}
                        {usernameError && <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '5px' }}>{usernameError}</p>}
                        {usernameAvailable && (
                            <p style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '5px' }}>Username is available</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                onChange={handleChange}
                                style={{
                                    borderColor: emailError ? '#ef4444' : (emailVerified ? '#22c55e' : ''),
                                    paddingRight: '100px' // Space for button
                                }}
                                disabled={emailVerified} // Disable if verified
                                required
                            />
                            {!emailVerified && formData.email && !emailError && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isSendingOtp || emailVerified || !emailAvailable || (otpSent && timer > 0)}
                                    style={{
                                        position: 'absolute',
                                        right: '5px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '5px 10px',
                                        background: otpSent && timer > 0 ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                        color: otpSent && timer > 0 ? '#9ca3af' : 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontSize: '0.8rem',
                                        cursor: (isSendingOtp || !emailAvailable || (otpSent && timer > 0)) ? 'not-allowed' : 'pointer',
                                        opacity: isSendingOtp || !emailAvailable ? 0.7 : 1
                                    }}
                                >
                                    {isSendingOtp ? "Sending..." : (otpSent && timer > 0 ? `Resend in ${timer}s` : (otpSent ? "Resend OTP" : "Send OTP"))}
                                </button>
                            )}
                            {emailVerified && (
                                <span style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#22c55e',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    Verified ✓
                                </span>
                            )}
                        </div>
                        {otpSent && !emailVerified && (
                            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="form-control"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    style={{
                                        padding: '0 15px',
                                        background: '#22c55e',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Verify
                                </button>
                            </div>
                        )}


                        {isCheckingEmail && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Checking availability...</p>}
                        {emailError && <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '5px' }}>{emailError}</p>}
                        {otpError && <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '5px' }}>{otpError}</p>}
                        {otpSuccess && <p style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '5px' }}>{otpSuccess}</p>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                onChange={handleChange}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                required
                            />
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: isPasswordFocused || formData.password.length > 0 ? 'var(--primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px',
                                    opacity: isPasswordFocused || formData.password.length > 0 ? 1 : 0,
                                    transition: 'all 0.2s',
                                    pointerEvents: isPasswordFocused || formData.password.length > 0 ? 'auto' : 'none'
                                }}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {/* Password Strength and Validation */}
                        {formData.password && (
                            <div style={{ marginTop: '10px' }}>
                                {/* Strength Bar */}
                                <div style={{ height: '5px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '5px' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${passwordStrength}%`,
                                        background: getStrengthColor(),
                                        transition: 'width 0.3s ease, background 0.3s ease'
                                    }} />
                                </div>

                                {/* Validation Checklist */}
                                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ color: formData.password.length >= 8 ? '#22c55e' : 'var(--text-muted)' }}>
                                        {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                                    </span>
                                    <span style={{ color: /[A-Z]/.test(formData.password) ? '#22c55e' : 'var(--text-muted)' }}>
                                        {/[A-Z]/.test(formData.password) ? '✓' : '○'} At least one uppercase letter
                                    </span>
                                    <span style={{ color: /[0-9]/.test(formData.password) ? '#22c55e' : 'var(--text-muted)' }}>
                                        {/[0-9]/.test(formData.password) ? '✓' : '○'} At least one number
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="form-control"
                                onChange={handleChange}
                                onFocus={() => setIsConfirmPasswordFocused(true)}
                                onBlur={() => setIsConfirmPasswordFocused(false)}
                                style={{
                                    borderColor: showMatchError ? '#ef4444' : (formData.confirmPassword && passwordsMatch ? '#22c55e' : '')
                                }}
                                required
                            />
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: isConfirmPasswordFocused || formData.confirmPassword.length > 0 ? 'var(--primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px',
                                    opacity: isConfirmPasswordFocused || formData.confirmPassword.length > 0 ? 1 : 0,
                                    transition: 'all 0.2s',
                                    pointerEvents: isConfirmPasswordFocused || formData.confirmPassword.length > 0 ? 'auto' : 'none'
                                }}
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {showMatchError && (
                            <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "5px" }}>
                                Passwords do not match
                            </p>
                        )}
                        {formData.confirmPassword && passwordsMatch && (
                            <p style={{ color: "#22c55e", fontSize: "0.8rem", marginTop: "5px" }}>
                                Passwords match
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Age</label>
                            <input type="number" name="age" className="form-control" onChange={handleChange} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Height (cm)</label>
                            <input type="number" name="height" className="form-control" onChange={handleChange} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Weight (kg)</label>
                            <input type="number" name="weight" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Activity Level</label>
                        <select name="activityLevel" className="form-control" onChange={handleChange}>
                            <option value="sedentary">Sedentary (Little or no exercise)</option>
                            <option value="light">Light (Light exercise/sports 1-3 days/week)</option>
                            <option value="medium">Medium (Moderate exercise/sports 3-5 days/week)</option>
                            <option value="active">Active (Hard exercise 6-7 days/week)</option>
                            <option value="very_active">Very Active (Very hard exercise & physical job)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Health Goal</label>
                        <select name="healthGoal" className="form-control" onChange={handleChange}>
                            <option value="weight_loss">Weight Loss</option>
                            <option value="muscle_gain">Muscle Gain</option>
                            <option value="stay_fit">Stay Fit</option>
                            <option value="endurance">Endurance</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={
                        !!usernameError ||
                        !!emailError ||
                        !emailVerified ||
                        formData.password.length < 8 ||
                        !/[A-Z]/.test(formData.password) ||
                        !/[0-9]/.test(formData.password)
                    }>
                        Sign Up
                    </button>
                </form>

                <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Already have an account? <Link to="/login" className="gradient-text" style={{ fontWeight: '600' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
