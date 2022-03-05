const db = require("../db/connection");

exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === "22P02" || err.code === "23502") {
		res.status(400).send({ msg: "bad request" });
	} else {
		next(err);
	}
};

exports.handle404s = (req, res) => {
	res.status(404).send({ msg: "invalid URL" });
};

exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "internal server error" });
};

exports.validateArtId = async (id) => {
	if (/^[0-9]+$/.test(id) === false) {
		return Promise.reject({ status: 400, msg: "bad request" });
	}

	const result = await db.query(
		`SELECT * FROM articles WHERE article_id = $1`,
		[id]
	);
	if (result.rows.length === 0) {
		return Promise.reject({ status: 404, msg: "not found" });
	}
};

exports.validateCommentId = async (id) => {
	if (/^[0-9]+$/.test(id) === false) {
		return Promise.reject({ status: 400, msg: "bad request" });
	}

	const result = await db.query(
		`SELECT * FROM comments WHERE comment_id = $1`,
		[id]
	);
	if (result.rows.length === 0) {
		return Promise.reject({ status: 404, msg: "not found" });
	}
};

exports.validateSortBy = async (sortBy) => {
	if (
		![
			"author",
			"title",
			"article_id",
			"body",
			"topic",
			"created_at",
			"votes",
			"comment_count",
		].includes(sortBy)
	) {
		return Promise.reject({ status: 400, msg: "Invalid sort query" });
	}
};

exports.validateOrder = async (order) => {
	if (!["asc", "desc"].includes(order)) {
		return Promise.reject({ status: 400, msg: "Invalid order query" });
	}
};

exports.validateUser = async (user) => {
	const result = await db.query(`SELECT * FROM users WHERE username = $1`, [
		user,
	]);
	if (result.rows.length === 0) {
		return Promise.reject({ status: 404, msg: "user not found" });
	}
};


