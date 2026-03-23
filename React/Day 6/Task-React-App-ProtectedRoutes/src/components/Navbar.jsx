import { Layout, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <h3 style={{ margin: 0 }}>
        <b>Application</b>
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>
          <strong>{user}</strong> ({role})
        </span>

        <Button danger size="small" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default Navbar;
