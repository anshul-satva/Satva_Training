import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const duration = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(duration);
  }, [isActive]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Smart Counter</h1>
        <p className="count">{count}</p>

        <div className="buttons">
          <button
            className={isActive ? "btn pause" : "btn start"}
            onClick={() => setIsActive((prev) => !prev)}
          >
            {isActive ? "Pause" : "Start"}
          </button>

          <button className="btn reset" onClick={() => setCount(0)}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
