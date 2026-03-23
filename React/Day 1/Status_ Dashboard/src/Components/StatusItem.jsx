import React from "react";

const StatusItem = ({ name, status }) => {
  const statusClass = status.toLowerCase();

  return (
    <div className="status-item">
      <span className="server-name">{name}</span>
      <div className={`server-status ${statusClass}`}>
        <div className="dot"></div>
        <span>{status}</span>
      </div>
    </div>
  );
};

export default StatusItem;