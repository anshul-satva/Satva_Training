import React from "react";
import { useState } from "react";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

function searchReducer(state, action) {
  switch (action.type) {
    case "CLEAR":
      return {
        ...state,
        data: [],
        error: action.payload,
      };
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

const App = () => {
  const [query, setQuery] = useState("");
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const navigate = useNavigate();

  const fetchUsers = async (searchQuery) => {
    if (!searchQuery) {
      dispatch({ type: "CLEAR" });
      return;
    }
    dispatch({ type: "FETCH_START" });
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users?q=${searchQuery}`,
      );
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error });
    }
  };

  return (
    <div>
    <h1>Search Here</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          (setQuery(e.target.value), fetchUsers(e.target.value));
        }}
      />
      {state.loading && <p>Loading...</p>}
      {state.error && <p style={{ color: "red" }}>Something went wrong!</p>}

      {state.data.map((user) => (
        <div key={user.id} onClick={() => navigate(`/user/${user.id}`)}>
          <h3>{user.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default App;
