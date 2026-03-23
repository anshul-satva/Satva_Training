import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="page">
      <h1 className="home-title">Users</h1>
      <div className="user-grid">
        <Link to={"/user/anshul"} className="user-card">
          Anshul
        </Link>
        <Link to={"/user/denish"} className="user-card">
          Denish
        </Link>
        <Link to={"/user/dhruv"} className="user-card">
          Dhruv
        </Link>
        <Link to={"/user/divy"} className="user-card">
          Divy
        </Link>
        <Link to={"/user/gourav"} className="user-card">
          Gourav
        </Link>
        <Link to={"/user/gourav"} className="user-card">
          Harshal
        </Link>
      </div>
    </div>
  );
};

export default Home;
