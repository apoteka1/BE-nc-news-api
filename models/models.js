const db = require("../db/connection");
const { getLookup } = require("./model_utils");
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

exports.fetchArticles = async (
  topic,
  sort_by = "created_at",
  order = "desc"
) => {
  if (
    ![
      "author",
      "title",
      "article_id",
      "body",
      "topic",
      "created_at",
      "votes",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryValues = [];
  let queryStr = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id `;
  
  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  queryStr += `GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}`;

  const result = await db.query(queryStr, queryValues);

  return result.rows;
};

exports.fetchCommentsByArtId = async (id) => {
  const result = await db.query(
    `SELECT * FROM comments WHERE article_id = $1`,
    [id]
  );

  return result.rows;
};

exports.postComment = async (username, article_id, body) => {
  const result = await db.query(
    `INSERT INTO comments 
    (author, article_id, body) 
    VALUES ($1, $2, $3) RETURNING *`,
    [username, article_id, body]
  );

  return result.rows[0];
};

exports.deleteComment = async (id) => {
  const result = await db.query(
    `DELETE FROM comments
    WHERE comment_id = $1`, [id]
  );
  
  return result.rowCount
};


