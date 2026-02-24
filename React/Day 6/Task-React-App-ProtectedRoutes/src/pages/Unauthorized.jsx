import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const UnAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2> UnAuthorized </h2>
      <Button type="primary" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </Button>
    </div>
  );
};

export default UnAuthorized;