import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { useLocation } from "react-router-dom";
import './Dashboard.css'

export default function AssetList({ safeRender = (v) => v }) {
  const { state } = useLocation();
  const assets = useMemo(() => state?.assets || [], [state?.assets]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filtering logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name?.toLowerCase().includes(search.toLowerCase()) ||
        asset.asset_name?.toLowerCase().includes(search.toLowerCase()) ||
        asset.id?.toString().includes(search);

      const matchesStatus =
        filterStatus === "" || asset.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [assets, search, filterStatus]);

  return (
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="section-title">Asset List</h3>

          <div className="icon-buttons">
            {/* Search Icon */}
            <div className="search-wrapper">
              <button className="icon-btn" onClick={() => {
                const box = document.getElementById("search-box");
                box.style.display = box.style.display === "flex" ? "none" : "flex";
              }}>
                <Search size={20} />
              </button>
            </div>

            {/* Filter Icon */}
            <button className="icon-btn" onClick={() => setShowFilterMenu(!showFilterMenu)}>
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <div
          id="search-box"
          style={{
            display: "none",
            padding: "0.8rem",
            borderBottom: "1px solid #ddd",
          }}
        >
          <input
            type="text"
            placeholder="Search by asset ID or name..."
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
            <p style={{ marginBottom: "6px", fontWeight: 600 }}>
              Filter by Status
            </p>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: "6px", width: "170px" }}
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>
        )}

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{safeRender(asset.id)}</td>
                    <td>{safeRender(asset.name || asset.asset_name)}</td>
                    <td>
                      <span
                        className={`badge ${
                          asset.status === "Active"
                            ? "badge-green"
                            : asset.status === "Operational"
                            ? "badge-orange"
                            : asset.status === "Maintenance"
                            ? "badge-yellow"
                            : asset.status === "Decommissioned"
                            ? "badge-red"
                            : "badge-gray"
                        }`}
                      >
                        {safeRender(asset.status)}
                      </span>
                    </td>
                    <td>{safeRender(asset.location)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No matching assets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
}
