import React from "react";
import Dashboard from "./Components/Dashboard";
import './App.css'

const App = () => {
  const servers = [
    { id: 1, name: "Database", status: "Online" },
    { id: 2, name: "API server", status: "Maintenance" },
    { id: 3, name: "Auth service", status: "Online" },
    { id: 4, name: "Storage", status: "Offline"},
    { id: 5, name: "Email Server", status: "Online"}
  ];
  return (
    <div className="app">
      <Dashboard servers={servers}/>
    </div>
  );
};

export default App;
