const db = require("../db/connection");

exports.fetchTopics = async () => {
  const result = await db.query(`SELECT * FROM topics;`);

  return result.rows;
};

exports.fetchArticleById = async (id) => {
  const result = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [id]
  );
  const article = result.rows[0];
  const { rows } = await db.query(
    `SELECT COUNT(*)::INT FROM comments WHERE article_id = $1;`,
    [id]
  );
  const commentCount = rows[0].count;
  return { ...article, comment_count: commentCount };
};

exports.incVotes = async (votes, article_id) => {
  const result = await db.query(
    `UPDATE articles
         SET votes = votes + $1
         WHERE article_id = $2
         RETURNING *`,
    [votes, article_id]
  );

  return result.rows[0];
};

exports.fetchArticles = async (sort_by, order, topic) => {
  let queryStr = `SELECT * FROM articles `;

  const result = await db.query(queryStr);

  return result.rows;
};

exports.fetchCommentsByArtId = async (id) => {};

exports.postComment = async (username, article_id, body) => {};

exports.deleteComment = async (id) => {};

exports.fetchEndpoints = async () => {};
