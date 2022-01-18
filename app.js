const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  patchArticle,
  getArticles,
  getCommentsByArtId,
  postCommentByArtId,
  deleteCommentById,
  getApi,
} = require("./controllers/controllers");
const {} = require("./error_handling/errors");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArtId);
app.post("/api/articles/:article_id/comments", postCommentByArtId);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api", getApi);

module.exports = app;
