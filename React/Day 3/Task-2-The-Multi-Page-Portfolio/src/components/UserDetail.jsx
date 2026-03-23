import React from "react";
import { Link, useParams } from "react-router-dom";

const UserDetail = () => {
  const { id } = useParams();
  return (
    <div className="page">
      <div className="user-detail-card">
         <h2>User name is : {id.toUpperCase()}</h2>
      </div>
    </div>
  );
};

export default UserDetail;
