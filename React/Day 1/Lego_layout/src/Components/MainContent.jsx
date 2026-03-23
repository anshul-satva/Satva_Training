import React from "react";

function MainContent({title}) {
  return (
    <div className="main-content">
      <h2>Welcome to {title}</h2>
      <p>
        This is the main content area. 
      </p>
    </div>
  );
}

export default MainContent;
