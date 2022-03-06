const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("handling invalid url's", () => {
	test("error 404 and error message for invalid url", () => {
		return request(app)
			.get("/api/invalid_url")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("invalid URL");
			});
	});
});

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
	test("BY DEFAULT it responds with an array of article objects, with added comment_count keys, in descending order of created_at", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then((res) => {
				const { articles } = res.body;

				expect(articles).toHaveLength(12);
				expect(articles).toBeInstanceOf(Array);
				expect(articles).toBeSortedBy("created_at", { descending: true });

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

	it("should respond with an array of article objects, filtered by given topic", () => {
		return request(app)
			.get("/api/articles?topic=cats")
			.expect(200)
			.then((res) => {
				const { articles } = res.body;

				expect(articles).toBeInstanceOf(Array);
				expect(articles).toHaveLength(1);
				articles.forEach((article) => {
					expect(article.topic).toBe("cats");
				});
			});
	});
	it("should respond with an empty array, given valid topic with no corresponding articles, with status 200", () => {
		return request(app)
			.get("/api/articles?topic=paper")
			.expect(200)
			.then((res) => {
				const { articles } = res.body;

				expect(articles).toBeInstanceOf(Array);
				expect(articles).toHaveLength(0);
			});
	});

	it("should respond with an array of article objects, with the given sort requests", () => {
		return request(app)
			.get("/api/articles?sort_by=title")
			.expect(200)
			.then((res) => {
				const { articles } = res.body;

				expect(articles).toBeInstanceOf(Array);
				expect(articles).toBeSortedBy("title", { descending: true });
			});
	});

	it("should respond with an array of article objects, with the given order requests", () => {
		return request(app)
			.get("/api/articles?order=asc")
			.expect(200)
			.then((res) => {
				const { articles } = res.body;

				expect(articles).toBeInstanceOf(Array);
				expect(articles).toBeSortedBy("created_at");
			});
	});

	it("can handle multiple queries", () => {
		return request(app)
			.get("/api/articles?sort_by=title&order=asc&topic=mitch")
			.expect(200)
			.then((res) => {
				const { articles } = res.body;

				expect(articles).toHaveLength(11);
				expect(articles).toBeInstanceOf(Array);
				expect(articles).toBeSortedBy("title");

				articles.forEach((article) => {
					expect(article.topic).toBe("mitch");
				});
			});
	});

	it("responds with status 404 if topic invalid", () => {
		return request(app)
			.get("/api/articles?topic=no_topics")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("topic not found");
			});
	});

	it("responds with status 400 if invalid sort_by query", () => {
		return request(app)
			.get("/api/articles?sort_by=invalid_sort_by")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid sort query");
			});
	});

	it("responds with status 400 if invalid order query", () => {
		return request(app)
			.get("/api/articles?order=invalid_order")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid order query");
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

	it("should respond with status 404 when id isn't present", () => {
		return request(app)
			.get("/api/articles/1000")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("not found");
			});
	});

	it("should respond with status 400 when id is invalid", () => {
		return request(app)
			.get("/api/articles/invalid")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("bad request");
			});
	});
});

describe("PATCH /api/articles/:article_id", () => {
	const testRequest = { inc_votes: 1 };
	const badRequest = { inc_votes: "invalid" };
	const wrongRequest = { invalid: 1 };
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

	it("should respond status 400 when inc_votes value is invalid", () => {
		return request(app)
			.patch("/api/articles/1")
			.send(badRequest)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("bad request");
			});
	});

	it("should respond with status 404 when id isn't present", () => {
		return request(app)
			.patch("/api/articles/1000")
			.send(testRequest)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("not found");
			});
	});

	it("should respond with status 400 when id is invalid", () => {
		return request(app)
			.patch("/api/articles/invalid_id")
			.send(testRequest)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("bad request");
			});
	});

	it("has no effect to article, with status 200 if missing `inc_votes` key.", () => {
		return request(app)
			.patch("/api/articles/1")
			.send(wrongRequest)
			.expect(200)
			.then((res) => {
				expect(res.body.article.votes).toBe(100);
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

	it("should respond with status 404 when id isn't present", () => {
		return request(app)
			.get("/api/articles/1000/comments")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("not found");
			});
	});

	it("should respond with status 400 when id is invalid", () => {
		return request(app)
			.get("/api/articles/invalid_id/comments")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("bad request");
			});
	});

	it("should respond with status 200 and empty array if no comments for given id", () => {
		return request(app)
			.get("/api/articles/4/comments")
			.expect(200)
			.then((res) => {
				expect(res.body.comments).toEqual([]);
			});
	});
});

describe("POST /api/articles/:article_id/comments", () => {
	const testPost = {
		username: "butter_bridge",
		body: "blah",
	};
	const incompletePost = {
		username: "butter_bridge",
	};
	const invalidUserPost = {
		username: "not_a_user",
		body: "blah",
	};
	const obesePost = {
		username: "butter_bridge",
		body: "blah",
		unnecessaryProperty: "blah",
	};

	it("should respond with an object containing the comment details, with the given article_id", () => {
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

	it("should respond with status 404 when article with  given id isn't present", () => {
		return request(app)
			.post("/api/articles/1000/comments")
			.send(testPost)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("not found");
			});
	});

	it("should respond with status 400 when id is invalid", () => {
		return request(app)
			.post("/api/articles/invalid_id/comments")
			.send(testPost)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("bad request");
			});
	});

	it("should respond with status 400 when fields missing from request body", () => {
		return request(app)
			.post("/api/articles/1/comments")
			.send(incompletePost)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("bad request");
			});
	});

	it("should respond with status 404 when username is not on database", () => {
		return request(app)
			.post("/api/articles/1/comments")
			.send(invalidUserPost)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("user not found");
			});
	});

	it("should ignore unnecessary query properties and respond with status 201 ", () => {
		return request(app)
			.post("/api/articles/1/comments")
			.send(obesePost)
			.expect(201)
			.then((res) => {
				const result = res.body.comment;

				expect(result.hasOwnProperty("unnecessaryProperty")).toBe(false);
				expect(result).toBeInstanceOf(Object);
				expect(result).toMatchObject({
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

	it("should respond with status 404 if no comment exists with given id", () => {
		return request(app)
			.delete("/api/comments/1000")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("not found");
			});
	});

	it("should respond with status 400 id is invalid", () => {
		return request(app)
			.delete("/api/comments/invalid")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("bad request");
			});
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
