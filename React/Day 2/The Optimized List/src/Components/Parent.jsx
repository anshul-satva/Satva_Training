import React from "react";
import Child from "./Child";
import { useState } from "react";
import { useEffect, useCallback } from "react";

const Parent = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 5" },
    { id: 6, name: "Item 6" },
    { id: 7, name: "Item 7" },
    { id: 8, name: "Item 8" },
    { id: 9, name: "Item 9" },
    { id: 10, name: "Item 10" },
  ]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);
  
  return (
    <div className="container">
      <h2>Current Time: {time.toLocaleTimeString()}</h2>
      <ul>
        {items.map((item) => (
            <Child 
                key={item.id}
                item={item}
                onDelete = {handleDelete}
            />
        ))}
      </ul>
    </div>
  );
};

export default Parent;
