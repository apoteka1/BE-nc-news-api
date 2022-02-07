const express = require("express");
const cors = require("cors");
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
const {
	handlePsqlErrors,
	handle404s,
	handleCustomErrors,
	handleServerErrors,
} = require("./error_handling/errors");

app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArtId);
app.post("/api/articles/:article_id/comments", postCommentByArtId);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api", getApi);

app.all("*", handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
