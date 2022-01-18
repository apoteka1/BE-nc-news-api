const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("should return array of topic objects", () => {
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

describe.only('GET /api/articles', () => {
 
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
  it("should return an object with all article keys plus a count of comments", () => {
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
  it("should return an object with the updated article", () => {
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

