import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "./store/moviesSlice";
import { Input, Spin, Card, Row, Col } from "antd";
import "./App.css";                         
const { Search } = Input;

function App() {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector((state) => state.movies);

  const onSearch = (value) => {
    if (value.trim()) {
      
      dispatch(fetchMovies(value));
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Movie Search</h1>

      <div className="search-wrapper">
        <Search
          placeholder="Search movie..."
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </div>

      {loading && (
        <div className="spin-wrapper">
          <Spin size="large" />
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      {!loading && (
        <Row gutter={[16, 16]}>
          {movies.map((movie) => (
            <Col xs={24} sm={12} md={8} lg={6} key={movie.id} className="card-col">
              <Card title={movie.title} className="movie-card">
                {movie.body}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default App;