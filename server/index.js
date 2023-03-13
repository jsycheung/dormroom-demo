require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { SERVER_PORT } = process.env;
const {
  seed,
  getPosts,
  getComments,
  getProfile,
  createComment,
  createPost,
  deletePost,
  editPost,
  getAPost,
} = require("./controller.js");
app.use(express.json());
app.use(cors());

app.post("/seed", seed);

app.get("/posts", getPosts);

app.get("/posts/:id", getAPost);

app.get("/comments", getComments);

app.get("/profile", getProfile);

app.post("/comments", createComment);

app.post("/posts", createPost);

app.delete("/posts/:id", deletePost);

app.put("/posts", editPost);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));
