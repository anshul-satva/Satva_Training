import "./App.css";
import { useState, useMemo } from "react";

const array_list = Array.from({ length: 5000 }, (_, i) => {
  return `Item ${i + 1}`;
});

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(false);

  const filteredItems = useMemo(() => {
    console.log("Filtering Heavy List...");

    return array_list.filter((item) =>
      item.trim().toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
    );
  }, [searchTerm]);

  return (
    <div className={`container ${isDark ? "dark" : "light"}`}>
      <div className="card">
        <h2>The Heavy Lifter Filter</h2>
        <button onClick={() => setIsDark((prev) => !prev)}>Toggle Theme</button>
        <br />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>String item is: {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
