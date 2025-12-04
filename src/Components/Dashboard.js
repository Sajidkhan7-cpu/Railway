import React, { useState, useEffect, useMemo } from 'react';
import { Menu, User, X, Package, MapPin, RefreshCw, ClipboardCheck, Home, AlertTriangle, Search, Filter } from 'lucide-react';
import './Dashboard.css'
import image from "./image.png";
import AccountMenu from "./Accountmenu";
import { supabase } from "../supabaseClient";
import { useNavigate } from 'react-router-dom';


// Primary dashboard shell that orchestrates every view and interaction.
export default function RailwayMitraSahyog() {
  // View-layer state for navigation, filters, and contextual modals.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterAssetId, setFilterAssetId] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterInspector, setFilterInspector] = useState('');

  // Supabase Data States
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [assets, setAssets] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*');
      if (alertsError) throw alertsError;

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*');
      if (eventsError) throw eventsError;

      // Fetch inspections with aliases to match UI expectations
      const { data: inspectionsData, error: inspectionsError } = await supabase
        .from('inspections')
        .select('*, assetId:asset_id, photos:photos_count');
      if (inspectionsError) throw inspectionsError;

      // Fetch assets with aliases to match UI expectations
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*, partType:part_type, manufacture:manufacture_date, received:received_date, installed:install_date, installDate:install_date');
      if (assetsError) throw assetsError;

      const { data: receiptsData, error: receiptsError } = await supabase
        .from('receipts')
        .select('*');
      if (receiptsError) throw receiptsError;
      if (alertsData) setAlerts(alertsData);
      if (eventsData) setEvents(eventsData);
      if (inspectionsData) setInspections(inspectionsData);
      if (assetsData) setAssets(assetsData);
      if (receiptsData) setReceipts(receiptsData);

      console.log("Fetched Data:", { alertsData, eventsData, inspectionsData, assetsData, receiptsData });

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely render potentially complex data types
  const safeRender = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return 'Invalid Data';
      }
    }
    return String(value);
  };

  // Sidebar menu definition used to drive navigation items and icons.
  const menuItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'lifecycle', name: 'Asset Life Cycle View', icon: RefreshCw },
    { id: 'inspection', name: 'Inspection Page', icon: ClipboardCheck }
  ];

  // Reference data for depot filters and mock datasets below.
  const depots = ['All Depots', 'Mumbai Central'];

  // Static list of schematic track segments.
  const trackSections = ['Section A', 'Section B', 'Section C', 'Section D'];

  // Resolve which dashboard subsection to render based on sidebar state.
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        // Home view: high-level KPIs and analytics.
        return (
          <div>
            <h2 className="page-title">Dashboard Overview</h2>

            {/* KPI snapshot across depots */}
            <div className="stats-grid">
              <div className="stat-card stat-blue " 
                onClick={() => navigate("/assets", { state: { assets } })}
                style={{cursor:"pointer"}}
              >
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="stat-label">Total Assets</p>
                    <p className="stat-value">{assets.length}</p>
                  </div>
                </div>
              </div>
    
              <div className="stat-card stat-purple">
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="stat-label">In Depot</p>
                    <p className="stat-value">{assets.filter(a => a.location === 'Depot').length}</p>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-green">
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <p className="stat-label">Today's Scan</p>
                    <p className="stat-value">{inspections.filter(i => i.date === new Date().toISOString().split('T')[0]).length}</p>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-orange">
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <p className="stat-label">Active Alerts</p>
                    <p className="stat-value">{alerts.length}</p>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-red">
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="stat-label">Vendor Failures</p>
                    <p className="stat-value">{events.filter(e => e.type === 'Failure').length}</p>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-yellow">
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <RefreshCw size={24} />
                  </div>
                  <div>
                    <p className="stat-label">Sync Errors</p>
                    <p className="stat-value">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational status distribution */}
            <div className="card mb-8">
              <h3 className="section-title">System Status</h3>
              <div className="status-grid">
                <div className="status-item status-blue">
                  <p className="status-label">Operational</p>
                  <p className="status-value">{assets.filter(a => a.status === 'Operational').length}</p>
                </div>
                <div className="status-item status-orange">
                  <p className="status-label">Under Maintenance</p>
                  <p className="status-value">{assets.filter(a => a.status === 'Maintenance').length}</p>
                </div>
                <div className="status-item status-red">
                  <p className="status-label">Decommissioned</p>
                  <p className="status-value">{assets.filter(a => a.status === 'Decommissioned').length}</p>
                </div>
              </div>
            </div>






















          </div>
        );
      case 'inventory':
        // Inventory view: depot filters and stock tables.
        return (
          <div>
            <h2 className="page-title">Inventory Management</h2>

            {/* Quick asset list preview with search/filter icons */}
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

            {/* CRN and GRN transaction history */}
            <div className="card mb-6">
              <h3 className="section-title">CRN/GRN History</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Document ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.map((record) => (
                      <tr key={record.id}>
                        <td className="font-medium">{safeRender(record.id)}</td>
                        <td>{safeRender(record.date)}</td>
                        <td>{safeRender(record.items)}</td>
                        <td>{safeRender(record.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full inventory table */}
            <div className="card">
              <h3 className="section-title">Inventory Items</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Part Type</th>
                      <th>Vendor</th>
                      <th>Batch</th>
                      <th>Quantity</th>
                      <th>Warranty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((item, idx) => (
                      <tr key={idx}>
                        <td>{safeRender(item.partType || item.name)}</td>
                        <td>{safeRender(item.vendor)}</td>
                        <td>{safeRender(item.batch)}</td>
                        <td>{safeRender(item.quantity)}</td>
                        <td>{safeRender(item.warranty)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'lifecycle':
        // Lifecycle view: manufacturing → installation timeline snapshots.
        return (
          <div>
            <h2 className="page-title">Asset Life Cycle View</h2>
            {/* Manufacturing-to-install timeline table */}
            <div className="card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Manufacture Date</th>
                      <th>Received Date</th>
                      <th>Installation Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((item, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">{item.asset || item.name}</td>
                        <td>{item.manufacture || 'N/A'}</td>
                        <td>{item.received || 'N/A'}</td>
                        <td>{item.installed || item.installDate || 'N/A'}</td>
                        <td>
                          <span className={`badge ${item.status === 'Operational' ? 'badge-green' : 
                            item.status === 'Decommissioned' ? 'badge-red' : 'badge-orange'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'track':
        // Track view: schematic and inspection log per section.
        return (
          <div>
            <h2 className="page-title">Track Section</h2>

            {/* Stylized schematic representing line health */}
            <div className="card mb-6">
              <h3 className="section-title">Track Schematic</h3>
              <div className="track-schematic">
                <div className="track-visual">
                  <div className="track-line track-line-top"></div>
                  <div className="track-line track-line-bottom"></div>
                  <div className="track-marker track-marker-1"></div>
                  <div className="track-marker track-marker-2"></div>
                  <div className="track-marker track-marker-3"></div>
                </div>
                <div className="track-legend">
                  <div className="legend-item">
                    <div className="legend-dot legend-blue"></div>Operational
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot legend-green"></div>Inspected
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot legend-orange"></div>Maintenance
                  </div>
                </div>
              </div>
            </div>

            {/* Section chooser for downstream tables */}
            <div className="card mb-6">
              <h3 className="section-title">Select Section</h3>
              <div className="button-group">
                {trackSections.map((section) => (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section)}
                    className={`btn ${selectedSection === section ? 'btn-active' : 'btn-inactive'}`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>

            {/* Assets deployed in the currently selected section */}
            <div className="card mb-6">
              <h3 className="section-title">Installed Assets - {selectedSection}</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Asset ID</th>
                      <th>Name</th>
                      <th>Installation Date</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.filter(a => !selectedSection || a.section === selectedSection).map((asset) => (
                      <tr key={asset.id}>
                        <td className="font-medium">{asset.id}</td>
                        <td>{asset.name}</td>
                        <td>{asset.installDate}</td>
                        <td>{asset.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Historical inspection outcomes */}
            <div className="card">
              <h3 className="section-title">Inspection Logs</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Inspector</th>
                      <th>Asset ID</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspections.map((log, idx) => (
                      <tr key={idx}>
                        <td>{log.date}</td>
                        <td>{log.inspector}</td>
                        <td>{log.assetId}</td>
                        <td>
                          <span className={`badge ${log.status === 'Pass' ? 'badge-yellow' : 
                            log.status === 'Fail' ? 'badge-red': 'badge-green'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td>{log.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'inspection':
        // Inspection view: filterable audit log with photo modal.
        const filteredRecords = inspections.filter(record => {
          return (!filterDate || record.date === filterDate) &&
            (!filterAssetId || (record.assetId && record.assetId.includes(filterAssetId))) &&
            (!filterVendor || (record.vendor && record.vendor.toLowerCase().includes(filterVendor.toLowerCase()))) &&
            (!filterSeverity || record.severity === filterSeverity) &&
            (!filterInspector || (record.inspector && record.inspector.toLowerCase().includes(filterInspector.toLowerCase())));
        });

        return (
          <div>
            <h2 className="page-title">Inspection Page</h2>

            {/* Advanced filters for narrowing inspection rows */}
            <div className="card mb-6">
              <h3 className="section-title">Filter By</h3>
              <div className="filter-grid">
                <div>
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-label">Asset ID</label>
                  <input
                    type="text"
                    value={filterAssetId}
                    onChange={(e) => setFilterAssetId(e.target.value)}
                    placeholder="Search asset..."
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-label">Vendor</label>
                  <input
                    type="text"
                    value={filterVendor}
                    onChange={(e) => setFilterVendor(e.target.value)}
                    placeholder="Search vendor..."
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-label">Severity</label>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="form-input"
                  >
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Inspector</label>
                  <input
                    type="text"
                    value={filterInspector}
                    onChange={(e) => setFilterInspector(e.target.value)}
                    placeholder="Search inspector..."
                    className="form-input"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setFilterDate('');
                  setFilterAssetId('');
                  setFilterVendor('');
                  setFilterSeverity('');
                  setFilterInspector('');
                }}
                className="btn-clear-filters"
              >
                Clear Filters
              </button>
            </div>

            {/* Filtered inspection summary */}
            <div className="card">
              <h3 className="section-title">Inspection Records</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Asset ID</th>
                      <th>Vendor</th>
                      <th>Severity</th>
                      <th>Inspector</th>
                      <th>Status</th>
                      <th>Photos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="font-medium">{record.id}</td>
                        <td>{record.date}</td>
                        <td>{record.assetId}</td>
                        <td>{record.vendor}</td>
                        <td>
                          <span className={`badge ${record.severity === 'Low' ? 'badge-green' :
                            record.severity === 'Medium' ? 'badge-yellow' :
                              'badge-red'
                            }`}>
                            {record.severity}
                          </span>
                        </td>
                        <td>{record.inspector}</td>
                        <td>
                          <span className={`badge ${record.status === 'Completed' ? 'badge-blue' : 
                          record.status === 'Fail' ? 'badge-orange': 
                          'badge-green'
                            }`}>
                            {record.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedPhoto(record.id);
                              setShowPhotoViewer(true);
                            }}
                            className="link-button"
                            style={{ cursor: 'pointer' }}
                          >
                            View ({record.photos})
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal showing placeholder inspection photos */}
            {showPhotoViewer && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title">Inspection Photos - {selectedPhoto}</h3>
                    <button
                      onClick={() => setShowPhotoViewer(false)}
                      className="modal-close"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="photo-grid">
                    <div className="photo-placeholder">
                      <span>Photo 1</span>
                    </div>
                    <div className="photo-placeholder">
                      <span>Photo 2</span>
                    </div>
                    <div className="photo-placeholder">
                      <span>Photo 3</span>
                    </div>
                    <div className="photo-placeholder">
                      <span>Photo 4</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        default:
      return null;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f9fafb' }}>
        <RefreshCw size={48} className="animate-spin" style={{ color: '#2563eb', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#4b5563', fontWeight: 500 }}>Loading Railway Data...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f9fafb' }}>
        <AlertTriangle size={48} style={{ color: '#dc2626', marginBottom: '1rem' }} />
        <p style={{ color: '#dc2626', fontWeight: 500, fontSize: '1.25rem' }}>Error loading data</p>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>{error}</p>
        <button
          onClick={fetchData}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Global header with branding, menu toggle, and account actions */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-button"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/* 🔥 Add Logo Here */}
            <div className="pic">
              <img
                src={image}
                alt="Logo"
                className="pics"
              />

            </div>
            <h1 className="app-title">Smart Track</h1>
          </div>
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="account-button"
          >
            <User size={24} />
            <span>Account</span>
          </button>
          {showAccountMenu && (
            <AccountMenu onClose={() => setShowAccountMenu(false)} />
          )}

        </div>
      </header>

      {/* Dismiss account popover when tapping outside */}
      {showAccountMenu && (
        <div
          className="overlay"
          onClick={() => setShowAccountMenu(false)}
        />
      )}

      <div className="main-wrapper">
        {/* Responsive sidebar navigation */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`nav-item ${activeSection === item.id ? 'nav-item-active' : ''}`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Section workspace */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      {/* Mobile overlay to hide sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}