import React from "react";
import { useState } from "react";
import { useReducer } from "react";
import "./App.css";

const initialState = {
  count: 0,
  history: [],
};

function countReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1,
        history: [...state.history, state.count],
      };
    case "DECREMENT":
      return {
        ...state,
        count: state.count - 1,
        history: [...state.history, state.count],
      };
    case "RESET":
      return {
        ...state,
        count: 0,
        history: [...state.history, state.count],
      };
    case "SET_VALUE":
      return {
        ...state,
        count: action.payload,
        history: [...state.history, state.count],
      };
    default:
      return state;
  }
}
const App = () => {
  const [state, dispatch] = useReducer(countReducer, initialState);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="card">
      <h2>Counter</h2>
      <p className="count-display">{state.count}</p>
      <div className="btn-group">
        <button
          className="btn-inc"
          onClick={() => dispatch({ type: "INCREMENT" })}
        >
          +
        </button>
        <button
          className="btn-dec"
          onClick={() => dispatch({ type: "DECREMENT" })}
        >
          -
        </button>
        <button
          className="btn-reset"
          onClick={() => dispatch({ type: "RESET" })}
        >
          RESET
        </button>
      </div>
      <div className="set-section">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        /> 
        <button 
        className="btn-set"
          onClick={() =>
            dispatch({ type: "SET_VALUE", payload: Number(inputValue) })
          }
        > 
          Set Value
        </button>
      </div>
      <div className="history">
        <span>History: </span>
        {state.history.join(' ')}
      </div>
    </div>
  );
};

export default App;
