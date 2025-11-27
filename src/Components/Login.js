import React, { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import images from "./images.png";

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [user, setuser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
  });

  // Redirect to dashboard if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard");
    });
  }, [user, navigate]);

  // Detect password reset link
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsResetMode(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isResetMode) {
        const { error } = await supabase.auth.updateUser({
          password: formData.newPassword,
        });

        if (error) throw error;
        alert("Password reset successful! Please log in again.");
        window.location.href = "/login";
        return;
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name } },
        });
        if (error) throw error;
        alert("Account created successfully! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        { redirectTo: window.location.origin + "/#type=recovery" }
      );
      if (error) throw error;
      alert("Password reset email sent!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="auth-bg">
      <div className="blur-circle circle1"></div>
      <div className="blur-circle circle2"></div>

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <img src={images} alt="Logo" className="login-logo" />
            </div>

            <h1>
              {isResetMode
                ? "Reset Password"
                : isLogin
                ? "Welcome Back!"
                : "Create Account"}
            </h1>
            <p>
              {isResetMode
                ? "Enter your new password"
                : isLogin
                ? "Sign in to continue"
                : "Join us and start your journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && !isResetMode && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-container">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </div>
              </div>
            )}

            {isResetMode ? (
              <>
                <label>New Password</label>
                <div className="input-container">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="New password"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-container">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-container">
                    <Lock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-container">
                      <Lock className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {isLogin && !isResetMode && (
              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? "Please wait..."
                : isResetMode
                ? "Update Password"
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {!isResetMode && (
            <div className="toggle-login">
              <span>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

