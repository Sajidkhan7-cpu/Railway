import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom";
import "./Dashboard.css";

export default function AlertList({ safeRender = (v) => v }) {
  const { state } = useLocation();
  const [alerts, setAlerts] = useState(state?.alerts || []);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Fetch alerts from database
  useEffect(() => {
    async function getAlerts() {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("date", { ascending: false });

      if (!error) setAlerts(data);
    }
    getAlerts();
  }, []);

  // Filter & search logic
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchSearch =
        alert.message?.toLowerCase().includes(search.toLowerCase()) ||
        alert.id?.toString().includes(search);

      const matchSeverity =
        filterSeverity === "" || alert.severity === filterSeverity;

      return matchSearch && matchSeverity;
    });
  }, [alerts, search, filterSeverity]);

  return (
    <div className="card mb-6">
      <div className="card-header">
        <h3 className="section-title">Alerts</h3>
        <div className="icon-buttons">
          <button
            className="icon-btn"
            onClick={() => {
              const box = document.getElementById("alert-search-box");
              box.style.display = box.style.display === "flex" ? "none" : "flex";
            }}
          >
            <Search size={20} />
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div
        id="alert-search-box"
        style={{
          display: "none",
          padding: "0.8rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          placeholder="Search by ID or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Filter Dropdown */}
      {showFilterMenu && (
        <div
          style={{
            position: "absolute",
            right: "2rem",
            background: "white",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "6px",
            zIndex: 10,
          }}
        >
          <p style={{ marginBottom: "6px", fontWeight: 600 }}>Filter by Severity</p>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{ padding: "6px", width: "170px" }}
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>Message</th>
              <th>Severity</th>
              <th>Date</th>
              <th>Active</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.id}</td>
                  <td>{alert.message}</td>
                  <td>
                    <span
                      className={`badge ${
                        alert.severity === "Low"
                          ? "badge-green"
                          : alert.severity === "Medium"
                          ? "badge-orange"
                          : alert.severity === "High"
                          ? "badge-yellow"
                          : alert.severity === "Critical"
                          ? "badge-red"
                          : "badge-gray"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td>{alert.date}</td>
                  <td>{alert.active ? "Yes" : "No"}</td>
                  <td>{new Date(alert.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No alerts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
