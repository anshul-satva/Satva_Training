import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Skeleton, Alert } from "antd";
import { fetchUsers } from "../store/userSlice";

const UserSearch = () => {
  const { users, loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div style={{ padding: 24 }}>
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {loading && <Skeleton active />}

      {!loading && !error && (
        <Row gutter={[16, 16]}>
          {users.map((user) => (
            <Col xs={24} sm={12} md={8} key={user.id}>
              <Card title=<b>{user.name}</b>>
                <p>
                  <b>Email : </b>
                  {user.email}
                </p>
                <p>
                  <b>Phone : </b>
                  {user.phone}
                </p>
                <p>
                  <b>Website : </b>
                  {user.website}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default UserSearch;
