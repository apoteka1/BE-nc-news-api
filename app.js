const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  patchArticle,
  getArticles
} = require("./controllers/controllers");
const {} = require("./errors/errors");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);

module.exports = app;
