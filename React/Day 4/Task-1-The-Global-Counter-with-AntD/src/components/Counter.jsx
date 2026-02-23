import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment, resetValue, setValue } from "../store/counterSlice";
import { Button, Typography, InputNumber, message } from "antd";
import { useState, useEffect } from "react";
const { Title } = Typography;
import "./Counter.css";

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const history = useSelector((state) => state.counter.history);
  const [Val, setVal] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (count !== 0 && count % 10 === 0) {
      message.success(`${count } is a multiple of 10`);
    }
  }, [count]);

return (
  <div className="counter-container">
    <div className="counter-card">
      <Title className="counter-title" level={1}>
        Count: {count}
      </Title>

      <div className="button-group">
        <Button type="primary" onClick={() => dispatch(increment())}>
          Increment
        </Button>
        <Button danger onClick={() => dispatch(decrement())}>
          Decrement
        </Button>
      </div>

      <div className="set-group">
        <InputNumber
          value={Val}
          onChange={(val) => setVal(val ?? 0)}
        />
        <Button onClick={() => dispatch(setValue(Val))}>
          SET
        </Button>
        <Button onClick={() => dispatch(resetValue())}>
          RESET
        </Button>
      </div>

      <div className="history-box">
        <strong>History:</strong> {history.join(" ")}
      </div>
    </div>
  </div>
);
};

export default Counter;
