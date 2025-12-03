import React from "react";
import { Search, Filter } from "lucide-react";

export default function AssetList({ assets = [], safeRender = (v) => v }) {
  if (!assets || assets.length === 0) {
    return (
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="section-title">Asset List</h3>
        </div>
        <p style={{ padding: "1rem" }}>No assets available.</p>
      </div>
    );
  }

  return (
    <div className="card mb-6">
      <div className="card-header">
        <h3 className="section-title">Asset List</h3>
        <div className="icon-buttons">
          <button className="icon-btn">
            <Search size={20} />
          </button>
          <button className="icon-btn">
            <Filter size={20} />
          </button>
        </div>
      </div>

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
            {assets.map((asset) => (
              <tr key={asset.id || asset.asset_id || Math.random()}>
                <td>{safeRender(asset.id || asset.asset_id)}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
