import React from "react";
import "./Counter.css";
import { Badge, Button, Switch } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment, reset, toggleLock } from "../store/counterSlice";
import { PlusOutlined, MinusOutlined, ReloadOutlined } from "@ant-design/icons";

const Counter = () => {
  const dispatch = useDispatch();
  const { count, locked } = useSelector((state) => state.counter);

  return (
    <div className="counter-wrapper">
      <div className="counter-card">
        <div className="counter-statistic">
          <Badge title="Count" count={count} > 
          Count
          </Badge>
        </div>
        <div className="counter-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => dispatch(increment())}
            disabled={locked}
          />
          <Button
            danger
            icon={<MinusOutlined />}
            onClick={() => dispatch(decrement())}
            disabled={locked}
          />
          <Button icon={<ReloadOutlined />} onClick={() => dispatch(reset())} />
        </div>

        <div>
          <span>
            <b>Lock</b>
          </span>
          <Switch
            checked={locked}
            checkedChildren="Locked"
            unCheckedChildren="Unlocked"
            onChange={() => dispatch(toggleLock())}
            style={{ marginLeft: 16 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Counter;
