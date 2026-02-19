import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./App.css";

const Data = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status">{error}</p>;
  return (
    <div>
      <div className="header">
        <button className="btn-refresh" onClick={fetchData}>
          Refresh
        </button>
      </div>
      <div className="page">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <span className="post-id">#{post.id}</span>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Data;
