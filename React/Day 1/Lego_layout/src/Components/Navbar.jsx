import React from "react";

function Navbar({ title }) {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">{title}</h1>
      <ul className="navbar-links">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}

export default Navbar;
