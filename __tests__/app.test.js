const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topics } = res.body;
        expect(topics).toHaveLength(3);
        expect(topics).toBeInstanceOf(Array);

        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  it("should respond with an array of article objects, with added comment_count keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeInstanceOf(Array);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("should respond with an array of article objects, with the given topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toHaveLength(1);
        expect(articles).toBeInstanceOf(Array);
        expect(articles[0].topic).toBe("cats");
      });
  });
  it("should respond with an array of article objects, with the given sort criteria and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("title");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  const expectedObj = {
    article_id: 1,
    title: "Living in the shadow of a great man",
    body: "I find this existence challenging",
    votes: 100,
    topic: "mitch",
    author: "butter_bridge",
    created_at: "2020-07-09T20:11:00.000Z",
    comment_count: 11,
  };
  it("should respond with an object with all article keys plus a count of comments", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        expect(article).toBeInstanceOf(Object);
        expect(article.comment_count).toBe(11);
        expect(article).toEqual(expectedObj);
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  const testRequest = { inc_votes: 1 };
  const expectedObj = {
    article_id: 1,
    title: "Living in the shadow of a great man",
    body: "I find this existence challenging",
    votes: 101,
    topic: "mitch",
    author: "butter_bridge",
    created_at: "2020-07-09T20:11:00.000Z",
  };
  it("should respond with an object with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(testRequest)
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        expect(article).toBeInstanceOf(Object);
        expect(article.votes).toBe(101);
        expect(article).toEqual(expectedObj);
      });
  });
});

describe("get /api/articles/:article_id/comments", () => {
  it("should respond with an array of comments for the given `article_id`", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("should respond with an object containing the comment details, with the given article_id", () => {
    const testPost = {
      username: "butter_bridge",
      body: "blah",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testPost)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toBeInstanceOf(Object);
        expect(res.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "blah",
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("should respond with status 204", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
});

describe("GET /api", () => {
  it("should respond with JSON containing info on all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Object);
      });
  });
});
