import { useRef, useState, useEffect } from "react";
import "./App.css";

function App() {
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    console.log("Count :" + count);
  }, [count]);

  return (
    <div className="container">
      <div className="card">
      <h3>useRef: Auto-Focus</h3> <br />
        <input ref={inputRef} type="text" />
        <br />
        <button onClick={() => setCount((prev) => prev + 1)}>Save Ref</button>
      </div>
    </div>
  );
}

export default App;
