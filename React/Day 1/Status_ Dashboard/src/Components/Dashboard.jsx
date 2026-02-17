import React from "react";
import StatusItem from "./StatusItem";

const Dashboard = ({ servers }) => {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Server Status Dashboard</h2>
      <div className="status-list">
        {servers.map((server) => (
          <StatusItem
            name={server.name}
            status={server.status}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;