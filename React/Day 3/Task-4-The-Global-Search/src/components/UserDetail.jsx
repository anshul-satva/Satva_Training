import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  });

  if (!user) return <p>Loading...</p>;

  return (
    <div>   
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Website: {user.website}</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default UserDetail;
