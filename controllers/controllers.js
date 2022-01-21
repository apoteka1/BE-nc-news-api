const {
  fetchTopics,
  fetchArticleById,
  incVotes,
  fetchArticles,
  fetchCommentsByArtId,
  postComment,
  deleteComment,
} = require("../models/models");
const endpoints = require("../endpoints.json");
const {
  validateArtId,
  validateCommentId,
} = require("../error_handling/errors");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  validateArtId(article_id)
    .then(() => fetchArticleById(article_id))
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body.inc_votes;

  validateArtId(article_id)
    .then(() => incVotes(votes, article_id))
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArtId = (req, res, next) => {
  const { article_id } = req.params;
  
  validateArtId(article_id)
    .then(() => fetchCommentsByArtId(article_id))
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArtId = (req, res, next) => {
  const { article_id } = req.params;
  const username = req.body.username;
  const body = req.body.body;

  validateArtId(article_id)
    .then(() => postComment(username, article_id, body))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  validateCommentId(comment_id)
    .then(() => deleteComment(comment_id))
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.getApi = (req, res, next) => {
  res.status(200).send(endpoints).catch(next);
};
