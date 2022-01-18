exports.formatTopics = (data) => {
  return [data.slug, data.description];
};
exports.formatUsers = (data) => {
  return [data.username, data.avatar_url, data.name];
};

exports.formatArticles = (data) => {
  return [data.title, data.body, data.votes, data.topic, data.author, data.created_at]
};

exports.formatComments = (data) => {
  return [data.author, data.article_id, data.votes, data.created_at, data.body]
};