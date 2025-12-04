import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import AssetList from "./Components/AssetList";
import AlertsList from "./Components/AlertsList";
import ProfileSettings from "./Components/ProfileSettings";
import ChangeEmail from "./Components/ChangeEmail";

export default function App() {
  return (
    <BrowserRouter basename="/Railway">
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* AssetList route */}
        <Route path="/assets" element={<AssetList/>} />

        {/* AssetList route */}
        <Route path="/alerts" element={<AlertsList/>} />

        {/* ProfileSetting */}
        <Route path="/profile-settings" element={<ProfileSettings />} />

        {/* Email change*/}
        <Route path="/change-email" element={<ChangeEmail />} /> 
      </Routes>
    </BrowserRouter>
  );
}
