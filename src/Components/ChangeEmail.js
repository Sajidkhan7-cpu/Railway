import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import './Dashboard.css';

export default function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentEmail(data.user.email);
      }
    }
    loadUser();
  }, []);

  const handleEmailUpdate = async () => {
    if (!newEmail.trim()) return alert("Email cannot be empty");
    if (newEmail === currentEmail) return alert("This email is already linked to your account");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setLoading(false);

    if (error) return alert(error.message);
    alert(
      "Verification link has been sent to your new email.\nPlease click the link to confirm your email change."
    );
  };

  // ✔ Trigger update on Enter press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEmailUpdate();
    }
  };

  return (
    <div className="form-container">
      <h2>Change Email</h2>

      <label>Current Email</label>
      <input type="email" disabled value={currentEmail} />

      <label>New Email</label>
      <input
        type="email"
        placeholder="Enter new email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        onKeyDown={handleKeyPress}   // ← Added here
      />

      <button onClick={handleEmailUpdate} disabled={loading}>
        {loading ? "Processing..." : "Update Email"}
      </button>
    </div>
  );
}
