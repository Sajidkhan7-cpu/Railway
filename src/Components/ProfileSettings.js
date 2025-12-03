import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Dashboard.css";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setName(
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          ""
        );
      }
    }
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return alert("Name cannot be empty");

    setLoading(true);
    await supabase.auth.updateUser({ data: { full_name: name } });
    setLoading(false);

    alert("Profile updated successfully");
  };

  // ✔ Detect Enter key and trigger save
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className="form-container">
      <h2>Profile Settings</h2>

      <label>Full Name</label>
      <input
        type="text"
        placeholder="Enter full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyPress}   // ← Added
      />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
