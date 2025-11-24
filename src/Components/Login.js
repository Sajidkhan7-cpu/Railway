import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import images from "./images.png";

// Dual-mode auth screen: handles both login and sign-up flows.
export default function Login() {
  const navigate = useNavigate();

  // UI toggles for auth mode and password visibility.
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form state shared across login and registration modes.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Submit handler performs minimal validation and fake navigation.
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      alert("Login successful!");
      navigate("/dashboard");   // <-- redirect to Dashboard
    } else {
      alert("Account created!");
      setIsLogin(true);
    }
  };

  // Generic change handler for all text inputs.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-bg">
      <div className="blur-circle circle1"></div>
      <div className="blur-circle circle2"></div>

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Hero/branding area */}
          <div className="auth-header">
             {/* 🔥 Add Logo Here */}
            <div className="logo-container">
              <img 
                src={images} 
                alt="Logo"
                className="login-logo"
              />
            </div>
            <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>
            <p>
              {isLogin
                ? "Sign in to continue your journey"
                : "Join us and start your adventure"}
            </p>
          </div>

          {/* Form container */}
          <div className="auth-form">
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                // Registration-only full name field.
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
                    />
                  </div>
                </div>
              )}

              {/* Email input */}
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
                  />
                </div>
              </div>

              {/* Password input plus show/hide toggle */}
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
                // Only visible during sign-up.
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
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                // Quick actions for login mode.
                <div className="login-options">
                  <label className="remember-me">
                    <input type="checkbox" /> Remember me
                  </label>
                  <button className="forgot-btn">Forgot password?</button>
                </div>
              )}

              <button className="submit-btn" type="submit">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Switch between login and registration */}
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
