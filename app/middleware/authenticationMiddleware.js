const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const authenticationMiddleware = (req, res, next) => {
    // console.log(JSON.stringify(req.headers));
    // let cookies =
    // Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    let bearer = req.headers['authorization'];
    let token = bearer.split(" ")[1];
    // console.log(token)

    if (token) {
        try {
            // token = cookies[process.env.COOKIE_NAME];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // pass user info to response locals
            // if (res.locals.html) {
            //     res.locals.loggedInUser = decoded;
            // }
            next();
        } catch (err) {
            if (res.locals.html) {
                res.redirect("/");
            } else {
                res.status(500).json({
                    errors: {
                        common: {
                            msg: "Authentication failure!",
                        },
                    },
                });
            }
        }
    } else {
        if (res.locals.html) {
            res.redirect("/");
        } else {
            res.status(401).json({
                error: "Authetication failure!",
            });
        }
    }
}

module.exports = {
    authenticationMiddleware
}