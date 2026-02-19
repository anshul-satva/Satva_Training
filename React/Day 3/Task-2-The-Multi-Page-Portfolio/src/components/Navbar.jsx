import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <NavLink to={"/"}>HOME</NavLink>
      <NavLink to={"/about"}>ABOUT</NavLink>
    </div>
  );
};

export default Navbar;
