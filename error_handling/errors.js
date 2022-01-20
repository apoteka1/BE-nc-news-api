exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === "22P02" || err.code === "23502"){
        res.status(400).send({msg: "bad request"})
    } else {
        next(err)
    }
};

exports.handle404s = (err, req, res, next) => {};

exports.handleCustomErrors = (err, req, res, next) => {};