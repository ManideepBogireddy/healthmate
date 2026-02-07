import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            await AuthService.forgotPassword(email);
            setStep(2);
            setTimer(60);
            setMessage("OTP sent to your email!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            await AuthService.verifyOtp(email, otp);
            setStep(3); // Move into reset
            setMessage("OTP Verified! Enter new password.");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or Expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            await AuthService.resetPassword(email, otp, newPassword);
            setMessage("Password updated successfully! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "80px",
            paddingBottom: "40px"
        }}>
            <div className="glass-card" style={{ maxWidth: "450px", width: "100%", margin: "0" }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.8rem', fontWeight: '700' }}>
                    Recover Password
                </h2>

                {message && <div style={{ color: "#22c55e", textAlign: "center", marginBottom: "1rem", background: "rgba(34, 197, 94, 0.1)", padding: "10px", borderRadius: "8px" }}>{message}</div>}
                {error && <div style={{ color: "#ef4444", textAlign: "center", marginBottom: "1rem", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="form-group">
                            <label>Enter your registered email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@example.com"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group">
                            <label>Enter OTP</label>
                            <input
                                type="text"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="6-digit code"
                            />
                            {timer > 0 ? (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Expires in {timer}s</p>
                            ) : (
                                <div style={{ marginTop: '5px' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>OTP Expired.</p>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.8rem', padding: '5px 10px', marginTop: '5px' }}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading || timer === 0}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter new password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
