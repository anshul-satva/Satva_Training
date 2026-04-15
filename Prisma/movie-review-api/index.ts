import express from "express";
import criticRoutes from "./src/routes/critic.routes";
import genreRoutes from "./src/routes/genre.routes";
import movieRoutes from "./src/routes/movie.routes";
import reviewRoutes from "./src/routes/review.routes";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use("/api/critics", criticRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

app.post("/health", (_req, res) => {
  res.json({
    message: "Movie Review API is Healthy!!",
    time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    body: _req.body,
    query: _req.query,
  });
});

app.get("/users/:id", (req, res) => {
  console.log(req.params);

  res.json({
    params: req.params,
  });
});

app.get("/", (_req, res) => {
  res.json({
    message: "Movie Review API is Running!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
