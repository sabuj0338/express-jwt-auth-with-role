const jwt = require("jsonwebtoken");
const createError = require("http-errors");

function verifyAuthMiddleware(role = [], isVerified = true) {
    return function (req, res, next) {
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

                if(req.user.role && role.includes(req.user.role)) {
                    if(req.user.verified_at || isVerified === false) {
                        next();
                    } else {
                        res.status(401).json({
                            error: "User not verified!",
                        });
                    }
                } else {
                    res.status(401).json({
                        error: "Permission denied!",
                    });
                }
    
                // pass user info to response locals
                // if (res.locals.html) {
                //     res.locals.loggedInUser = decoded;
                // }
                
            } catch (err) {
                res.status(401).json({
                    error: "Authetication failure!",
                });
            }
        } else {
            res.status(401).json({
                error: "Authetication failure!",
            });
        }
    }
}

// const verifyAuthMiddleware = (req, res, next) => {
//     // console.log(JSON.stringify(req.headers));
//     // let cookies =
//     // Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
//     let bearer = req.headers['authorization'];
//     let token = bearer.split(" ")[1];
//     // console.log(token)

//     if (token) {
//         try {
//             // token = cookies[process.env.COOKIE_NAME];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = decoded;

//             // pass user info to response locals
//             // if (res.locals.html) {
//             //     res.locals.loggedInUser = decoded;
//             // }
//             next();
//         } catch (err) {
//             res.status(401).json({
//                 error: "Authetication failure!",
//             });
//         }
//     } else {
//         res.status(401).json({
//             error: "Authetication failure!",
//         });
//     }
// }

module.exports = {
    verifyAuthMiddleware
}