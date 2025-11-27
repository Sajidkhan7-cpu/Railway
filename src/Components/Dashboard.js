import React, { useState } from 'react';
import { Menu, User, X, Package, MapPin, RefreshCw, ClipboardCheck, FileText, Users, Home, TrendingUp, Activity, AlertTriangle, Search, Filter } from 'lucide-react';
import './Dashboard.css'
import images from "./images.png";
import AccountMenu from "./Accountmenu";

// Primary dashboard shell that orchestrates every view and interaction.
export default function RailwayMitraSahyog() {
  // View-layer state for navigation, filters, and contextual modals.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedDepot, setSelectedDepot] = useState('all');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterAssetId, setFilterAssetId] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterInspector, setFilterInspector] = useState('');

  // Sidebar menu definition used to drive navigation items and icons.
  const menuItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'track', name: 'Track Section', icon: MapPin },
    { id: 'lifecycle', name: 'Asset Life Cycle View', icon: RefreshCw },
    { id: 'inspection', name: 'Inspection Page', icon: ClipboardCheck },
    { id: 'warranty', name: 'Warranty Claims', icon: FileText },
    { id: 'user', name: 'User Management', icon: Users }
  ]; 

  // Reference data for depot filters and mock datasets below.
  const depots = ['All Depots', 'Mumbai Central', 'Delhi Junction', 'Kolkata Station', 'Chennai Depot'];
  
  // Depot-specific asset catalog used in the inventory table.
  const assetList = [
    { id: 'AST001', name: 'Signal Controller', status: 'Active', location: 'Mumbai Central' },
    { id: 'AST002', name: 'Track Sensor', status: 'Maintenance', location: 'Delhi Junction' },
    { id: 'AST003', name: 'Power Module', status: 'Active', location: 'Kolkata Station' },
    { id: 'AST004', name: 'Safety Switch', status: 'Active', location: 'Chennai Depot' },
  ];

  // Mock CRN/GRN trail for goods movement.
  const crnHistory = [
    { id: 'CRN001', date: '2025-11-15', items: 45, value: '₹2,45,000' },
    { id: 'GRN002', date: '2025-11-10', items: 32, value: '₹1,89,500' },
    { id: 'CRN003', date: '2025-11-05', items: 28, value: '₹1,56,000' },
  ];

  // Deep-dive table backing the inventory detail grid.
  const inventoryItems = [
    { partType: 'Signal Controller', vendor: 'TechRail Inc', batch: 'B2025-01', quantity: 150, warranty: '3 Years' },
    { partType: 'Track Sensor', vendor: 'SafeTrack Ltd', batch: 'B2025-02', quantity: 200, warranty: '2 Years' },
    { partType: 'Power Module', vendor: 'PowerTech Co', batch: 'B2025-03', quantity: 85, warranty: '5 Years' },
    { partType: 'Safety Switch', vendor: 'SecureRail', batch: 'B2025-04', quantity: 120, warranty: '4 Years' },
  ];

  // Timeline checkpoints per asset for lifecycle visualization.
  const lifecycleData = [
    { asset: 'Signal Controller', manufacture: '2024-08-15', received: '2024-09-01', installed: '2024-09-15', status: 'Operational' },
    { asset: 'Track Sensor', manufacture: '2024-07-20', received: '2024-08-05', installed: '2024-08-20', status: 'Operational' },
    { asset: 'Power Module', manufacture: '2024-09-10', received: '2024-09-25', installed: '2024-10-10', status: 'Under Maintenance' },
  ];

  // Static list of schematic track segments.
  const trackSections = ['Section A', 'Section B', 'Section C', 'Section D'];
  
  // Asset instances displayed for the selected track section.
  const sectionAssets = [
    { id: 'AST101', name: 'Signal Controller', installDate: '2024-09-15', location: 'KM 45.2' },
    { id: 'AST102', name: 'Track Sensor', installDate: '2024-08-20', location: 'KM 47.8' },
    { id: 'AST103', name: 'Power Module', installDate: '2024-10-10', location: 'KM 50.1' },
  ];

  // Recent inspections per track segment for quick history.
  const inspectionLogs = [
    { date: '2025-11-20', inspector: 'John Doe', assetId: 'AST101', status: 'Pass', notes: 'All systems normal' },
    { date: '2025-11-18', inspector: 'Jane Smith', assetId: 'AST102', status: 'Warning', notes: 'Minor adjustment needed' },
    { date: '2025-11-15', inspector: 'Bob Wilson', assetId: 'AST103', status: 'Pass', notes: 'Operating within specs' },
  ];

  // Master inspection dataset consumed by filters on the inspection page.
  const inspectionRecords = [
    { id: 'INS001', date: '2025-11-20', assetId: 'AST101', vendor: 'TechRail Inc', severity: 'Low', inspector: 'John Doe', status: 'Completed', photos: 3 },
    { id: 'INS002', date: '2025-11-18', assetId: 'AST102', vendor: 'SafeTrack Ltd', severity: 'Medium', inspector: 'Jane Smith', status: 'Completed', photos: 5 },
    { id: 'INS003', date: '2025-11-15', assetId: 'AST103', vendor: 'PowerTech Co', severity: 'Low', inspector: 'Bob Wilson', status: 'Completed', photos: 2 },
    { id: 'INS004', date: '2025-11-12', assetId: 'AST104', vendor: 'SecureRail', severity: 'High', inspector: 'Alice Brown', status: 'Pending', photos: 4 },
  ];

  // Warranty claim register powering the claims table.
  const warrantyClaims = [
    { id: 'CLM001', date: '2025-11-15', assetId: 'AST102', vendor: 'SafeTrack Ltd', issue: 'Sensor malfunction', status: 'Under Review', response: 'Pending' },
    { id: 'CLM002', date: '2025-11-10', assetId: 'AST105', vendor: 'TechRail Inc', issue: 'Power failure', status: 'Approved', response: 'Replacement approved' },
    { id: 'CLM003', date: '2025-11-05', assetId: 'AST107', vendor: 'PowerTech Co', issue: 'Circuit board issue', status: 'Rejected', response: 'Outside warranty period' },
  ];

  // Resolve which dashboard subsection to render based on sidebar state.
  const renderContent = () => {
    switch(activeSection) {
      case 'home':
        // Home view: high-level KPIs and analytics.
        return (
          <div>
            <h2 className="page-title">Dashboard Overview</h2>

            {/* KPI snapshot across depots */}
            <div className="stats-grid">
              <div className="stat-card stat-blue">
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="stat-label">Total Assets Installed</p>
                    <p className="stat-value">2,847</p>
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
                    <p className="stat-value">342</p>
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
                    <p className="stat-value">156</p>
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
                    <p className="stat-value">23</p>
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
                    <p className="stat-value">8</p>
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
                    <p className="stat-value">5</p>
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
                  <p className="status-value">2,505</p>
                </div>
                <div className="status-item status-orange">
                  <p className="status-label">Under Maintenance</p>
                  <p className="status-value">187</p>
                </div>
                <div className="status-item status-red">
                  <p className="status-label">Decommissioned</p>
                  <p className="status-value">155</p>
                </div>
              </div>
            </div>

            <div className="section-divider"></div>

            {/* Embedded analytics tiles */}
            <div>
              <h3 className="analytics-title">Analytics & Reports</h3>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-header">
                    <h4 className="analytics-card-title">Installation Over Time</h4>
                    <div className="analytics-icon analytics-icon-blue">
                      <TrendingUp size={24} />
                    </div>
                  </div>
                  <div className="chart-container chart-blue">
                    <div className="bar-chart">
                      <div className="bar" style={{height: '50%'}}></div>
                      <div className="bar" style={{height: '65%'}}></div>
                      <div className="bar" style={{height: '45%'}}></div>
                      <div className="bar" style={{height: '80%'}}></div>
                      <div className="bar" style={{height: '70%'}}></div>
                      <div className="bar" style={{height: '90%'}}></div>
                    </div>
                  </div>
                  <p className="analytics-description">Track asset installation trends</p>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h4 className="analytics-card-title">Inspection Activity</h4>
                    <div className="analytics-icon analytics-icon-green">
                      <Activity size={24} />
                    </div>
                  </div>
                  <div className="chart-container chart-green">
                    <div className="donut-chart">
                      <svg className="donut-svg">
                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                        <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="12" fill="none"
                          strokeDasharray="351.86" strokeDashoffset="87.96" strokeLinecap="round" />
                      </svg>
                      <div className="donut-label">
                        <span className="donut-percentage">75%</span>
                      </div>
                    </div>
                  </div>
                  <p className="analytics-description">Monitor inspection completion</p>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h4 className="analytics-card-title">Failure Rate</h4>
                    <div className="analytics-icon analytics-icon-red">
                      <AlertTriangle size={24} />
                    </div>
                  </div>
                  <div className="chart-container chart-red">
                    <div className="bar-chart bar-chart-red">
                      <div className="bar" style={{height: '30%'}}></div>
                      <div className="bar" style={{height: '25%'}}></div>
                      <div className="bar" style={{height: '35%'}}></div>
                      <div className="bar" style={{height: '20%'}}></div>
                      <div className="bar" style={{height: '28%'}}></div>
                      <div className="bar" style={{height: '22%'}}></div>
                    </div>
                  </div>
                  <p className="analytics-description">Track equipment failures</p>
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

            {/* Depot selector to scope data */}
            <div className="card mb-6">
              <h3 className="section-title">Depot Selection</h3>
              <div className="button-group">
                {depots.map((depot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDepot(depot)}
                    className={`btn ${selectedDepot === depot ? 'btn-active' : 'btn-inactive'}`}
                  >
                    {depot}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick asset list preview with search/filter icons */}
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
                    {assetList.map((asset) => (
                      <tr key={asset.id}>
                        <td>{asset.id}</td>
                        <td>{asset.name}</td>
                        <td>
                          <span className={`badge ${asset.status === 'Active' ? 'badge-green' : 'badge-orange'}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td>{asset.location}</td>
                      </tr>
                    ))}
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
                    {crnHistory.map((record) => (
                      <tr key={record.id}>
                        <td className="font-medium">{record.id}</td>
                        <td>{record.date}</td>
                        <td>{record.items}</td>
                        <td>{record.value}</td>
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
                    {inventoryItems.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.partType}</td>
                        <td>{item.vendor}</td>
                        <td>{item.batch}</td>
                        <td>{item.quantity}</td>
                        <td>{item.warranty}</td>
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
                    {lifecycleData.map((item, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">{item.asset}</td>
                        <td>{item.manufacture}</td>
                        <td>{item.received}</td>
                        <td>{item.installed}</td>
                        <td>
                          <span className={`badge ${item.status === 'Operational' ? 'badge-green' : 'badge-orange'}`}>
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
                    {sectionAssets.map((asset) => (
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
                    {inspectionLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td>{log.date}</td>
                        <td>{log.inspector}</td>
                        <td>{log.assetId}</td>
                        <td>
                          <span className={`badge ${log.status === 'Pass' ? 'badge-green' : 'badge-yellow'}`}>
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
        const filteredRecords = inspectionRecords.filter(record => {
          return (!filterDate || record.date === filterDate) &&
                 (!filterAssetId || record.assetId.includes(filterAssetId)) &&
                 (!filterVendor || record.vendor.toLowerCase().includes(filterVendor.toLowerCase())) &&
                 (!filterSeverity || record.severity === filterSeverity) &&
                 (!filterInspector || record.inspector.toLowerCase().includes(filterInspector.toLowerCase()));
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
                          <span className={`badge ${
                            record.severity === 'Low' ? 'badge-green' :
                            record.severity === 'Medium' ? 'badge-yellow' :
                            'badge-red'
                          }`}>
                            {record.severity}
                          </span>
                        </td>
                        <td>{record.inspector}</td>
                        <td>
                          <span className={`badge ${
                            record.status === 'Completed' ? 'badge-blue' : 'badge-orange'
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
      
      case 'warranty':
        // Warranty view: claim intake form and claim registry.
        return (
          <div>
            <h2 className="page-title">Warranty Claims</h2>

            {/* Quick action to surface the claim form */}
            <div className="mb-6">
              <button
                onClick={() => setShowClaimForm(!showClaimForm)}
                className="btn-primary"
              >
                {showClaimForm ? 'Cancel' : '+ Create New Claim'}
              </button>
            </div>

            {/* Inline form for drafting a fresh warranty claim */}
            {showClaimForm && (
              <div className="card mb-6">
                <h3 className="section-title">Create Warranty Claim</h3>
                <div className="form-grid">
                  <div>
                    <label className="input-label">Asset ID</label>
                    <input
                      type="text"
                      placeholder="Enter asset ID"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-label">Vendor</label>
                    <select className="form-input">
                      <option>Select vendor</option>
                      <option>TechRail Inc</option>
                      <option>SafeTrack Ltd</option>
                      <option>PowerTech Co</option>
                      <option>SecureRail</option>
                    </select>
                  </div>
                  <div className="form-full-width">
                    <label className="input-label">Issue Description</label>
                    <textarea
                      placeholder="Describe the issue..."
                      rows="3"
                      className="form-input"
                    ></textarea>
                  </div>
                  <div className="form-full-width">
                    <label className="input-label">Upload Documents</label>
                    <div className="upload-area">
                      <FileText className="upload-icon" size={32} />
                      <p className="upload-text">Click to upload or drag and drop</p>
                      <p className="upload-subtext">PDF, DOC, Images (Max 10MB)</p>
                    </div>
                  </div>
                </div>
                <button className="btn-success">
                  Submit Claim
                </button>
              </div>
            )}

            {/* Master list of all warranty claims */}
            <div className="card">
              <h3 className="section-title">All Claims</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Claim ID</th>
                      <th>Date</th>
                      <th>Asset ID</th>
                      <th>Vendor</th>
                      <th>Issue</th>
                      <th>Status</th>
                      <th>Vendor Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warrantyClaims.map((claim) => (
                      <tr key={claim.id}>
                        <td className="font-medium">{claim.id}</td>
                        <td>{claim.date}</td>
                        <td>{claim.assetId}</td>
                        <td>{claim.vendor}</td>
                        <td>{claim.issue}</td>
                        <td>
                          <span className={`badge ${
                            claim.status === 'Approved' ? 'badge-green' :
                            claim.status === 'Rejected' ? 'badge-red' :
                            'badge-yellow'
                          }`}>
                            {claim.status}
                          </span>
                        </td>
                        <td>{claim.response}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'user':
        // Placeholder for future user-management interface.
        return (
          <div>
            <h2 className="page-title">User Management</h2>
            {/* Placeholder block until user tooling ships */}
            <div className="card">
              <div className="coming-soon">
                <div className="coming-soon-content">
                  <div className="coming-soon-icon">
                    <RefreshCw size={64} />
                  </div>
                  <h3 className="coming-soon-title">Coming Soon...</h3>
                  <p className="coming-soon-text">User management features will be available soon.</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
                src={images} 
                alt="Logo"
                className="pics"
              />

            </div>
            <h1 className="app-title">Railway Help</h1>
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