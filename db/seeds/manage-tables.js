const db = require("../connection");
const format = require("pg-format");
const {
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
} = require("./data-formatting-utils");

exports.dropTable = (table_name) => {
  return db.query(`DROP TABLE IF EXISTS ${table_name}`);
};

exports.createTopics = () => {
  return db.query(
    `CREATE TABLE topics (
    slug TEXT PRIMARY KEY,
    description TEXT NOT NULL
  )`
  );
};

exports.createUsers = () => {
  return db.query(
    `CREATE TABLE users (
    username TEXT PRIMARY KEY,
    avatar_url TEXT NOT NULL,
    name TEXT NOT NULL
  )`
  );
};

exports.createArticles = () => {
  return db.query(
    `CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    topic TEXT REFERENCES topics(slug),
    author TEXT REFERENCES users(username) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
  );
};

exports.createComments = () => {
  return db.query(
    `CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author TEXT REFERENCES users(username) NOT NULL,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body TEXT NOT NULL
  )`
  );
};

exports.insertTopics = (data) => {
  const inputArr = data.map(formatTopics);

  const queryStr = format(
    `INSERT INTO topics
    (slug, description)
    VALUES %L`,
    inputArr
  );

  return db.query(queryStr);
};

exports.insertUsers = (data) => {
  const inputArr = data.map(formatUsers);
  const queryStr = format(
    `INSERT INTO users
    (username, avatar_url, name)
    VALUES %L`,
    inputArr
  );

  return db.query(queryStr);
};

exports.insertArticles = (data) => {
  const inputArr = data.map(formatArticles);

  const queryStr = format(
    `INSERT INTO articles
    (title, body, votes, topic, author, created_at)
    VALUES %L`,
    inputArr
  );

  return db.query(queryStr);
};

exports.insertComments = (data) => {
  const inputArr = data.map(formatComments);

  const queryStr = format(
    `INSERT INTO comments
    (author, article_id, votes, created_at, body) 
    VALUES %L
    `,
    inputArr
  );

  return db.query(queryStr);
};
