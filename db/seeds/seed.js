const {
  dropTable,
  createTopics,
  createUsers,
  createArticles,
  createComments,
  insertTopics,
  insertUsers,
  insertArticles,
  insertComments,
} = require("./manage-tables");
const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return dropTable("comments")
    .then(() => dropTable("articles"))
    .then(() => dropTable("users"))
    .then(() => dropTable("topics"))
    .then(() => createTopics())
    .then(() => createUsers())
    .then(() => createArticles())
    .then(() => createComments())
    .then(() => insertTopics(topicData))
    .then(() => insertUsers(userData))
    .then(() => insertArticles(articleData))
    .then(() => insertComments(commentData));
};

module.exports = seed;
