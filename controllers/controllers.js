const {
  fetchTopics,
  fetchArticleById,
  incVotes,
  fetchArticles,
  fetchCommentsByArtId,
  postComment,
  deleteComment,
  fetchEndpoints,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body.inc_votes;

  incVotes(votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArtId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArtId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArtId = (req, res, next) => {
  const { article_id } = req.params;
  const username = req.body.username;
  const body = req.body.body;
  postComment(username, article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getApi = (req, res, next) => {
  fetchEndpoints()
    .then((endpointJSON) => {
      res.status(200).send(endpointJSON);
    })
    .catch(next);
};
