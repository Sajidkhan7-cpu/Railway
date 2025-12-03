import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AccountMenu({ onClose }) {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const user = data.user;
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "User";
        setProfile({ name, email: user.email });
      }
    }
    getUser();
  }, []);

  const avatarInitials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  // 🔥 Correct Working Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // redirect first
    onClose();           // then close menu
  };

  return (
    <>
      <div className="account-menu">
        {/* HEADER */}
        <div className="account-menu-header">
          <div className="account-avatar">
            {profile.photo ? (
            <img src={profile.photo} alt="avatar" className="avatar-img" />
            ) : (
              avatarInitials
            )}
          </div>
          <div className="account-info">
            <p className="account-name">{profile.name}</p>
            <p className="account-email">{profile.email}</p>
          </div>
        </div>

        {/* MENU ITEMS */}
        <button
          className="account-menu-item"
          onClick={() => {
            navigate("/profile-settings");
            onClose();
          }}
        >
          <div className="menu-item-icon">
            <User size={18} />
          </div>
          <span className="menu-item-text">Profile Settings</span>
        </button>

        <button
          className="account-menu-item"
          onClick={() => {
            navigate("/change-email");
            onClose();
          }}
        >
          <div className="menu-item-icon">
            <svg className="icon-svg" viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <span className="menu-item-text">Change Email</span>
        </button>

        {/* FOOTER */}
        <div className="account-menu-footer">
          <button className="logout-button" onClick={handleLogout}>
            <div className="menu-item-icon logout-icon">
              <svg className="icon-svg" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <div className="overlay" onClick={onClose} />
    </>
  );
}
