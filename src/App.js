import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import AssetList from "./Components/AssetList";

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
      </Routes>
    </BrowserRouter>
  );
}
