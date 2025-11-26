import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";   // <-- Supabase import
import images from "./images.png";

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // 🔑 LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        navigate("/dashboard");
      } else {
        // ✨ SIGN UP
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.name },
          },
        });

        if (error) throw error;

        alert("Account created successfully! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>
            <p>
              {isLogin
                ? "Sign in to continue your journey"
                : "Join us and start your adventure"}
            </p>
          </div>

          <div className="auth-form">
            <form onSubmit={handleSubmit}>
              {/* Name for Sign Up only */}
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-container">
                    <User className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
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

              {/* Password */}
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

              {/* Confirm Password for Sign Up only */}
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

              {isLogin && (
                <div className="login-options">
                  <label className="remember-me">
                    <input type="checkbox" /> Remember me
                  </label>
                  <button type="button" className="forgot-btn">
                    Forgot password?
                  </button>
                </div>
              )}

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

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
          </div>
        </div>
      </div>
    </div>
  );
}
