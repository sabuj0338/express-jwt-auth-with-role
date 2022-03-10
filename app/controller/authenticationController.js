const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../model/userModel");
const sendMail = require("../../mailer/email");

// get login page
// function getLogin(req, res, next) {
//     res.render("index");
// }

function me(req, res, next) {
    res.status(200).json({
        "data" : req.user,
        "message" : "success"
    });
}
  
// do login
async function login(req, res, next) {
    try {
        // find a user who has this email/username
        const user = await User.findOne({
            $or: [{ email: req.body.email }, { mobile: req.body.email }],
        });

        if (user && user._id) {
            
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            
            if (isValidPassword) {
                // prepare the user object to generate token
                const userObject = {
                    userid: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar || null,
                    role: user.role || "user",
                };
                
                // generate token
                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY,
                });

                // set cookie
                // res.cookie(process.env.COOKIE_NAME, token, {
                //     maxAge: process.env.JWT_EXPIRY,
                //     httpOnly: true,
                //     signed: true,
                // });

                // set logged in user local identifier
                // res.locals.loggedInUser = userObject;

                res.status(200).json({
                    "message" : "login successfull",
                    "data" : {
                        "user" : userObject,
                        "token" : token
                    }
                });
            } else {
                throw createError("Login failed! Please try again.");
            }
        } else {
            throw createError("Login failed! Please try again.");
        }
    } catch (err) {
        res.status(200).json({
            data: {
                email: req.body.email,
            },
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}

// do register
async function register(req, res, next) {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.files && req.files.length > 0) {
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashedPassword,
        });
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
    }

    // save user or send error
    try {
        const result = await newUser.save();
        res.status(200).json({
            message: "Registration successfull!",
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occured!",
                },
            },
        });
    }
    // try {
    //     // find a user who has this email/username
    //     const user = await User.findOne({ email: req.body.email });

    //     if (user && user._id) {
    //         const isValidPassword = await bcrypt.compare(
    //             req.body.password,
    //             user.password
    //         );

    //         if (isValidPassword) {
    //             // prepare the user object to generate token
    //             const userObject = {
    //                 userid: user._id,
    //                 name: user.name,
    //                 email: user.email,
    //                 avatar: user.avatar || null,
    //                 role: user.role || "user",
    //             };

    //             // generate token
    //             const token = jwt.sign(userObject, process.env.JWT_SECRET, {
    //                 expiresIn: process.env.JWT_EXPIRY,
    //             });

    //             // set cookie
    //             res.cookie(process.env.COOKIE_NAME, token, {
    //                 maxAge: process.env.JWT_EXPIRY,
    //                 httpOnly: true,
    //                 signed: true,
    //             });

    //             // set logged in user local identifier
    //             res.locals.loggedInUser = userObject;

    //             res.redirect("inbox");
    //         } else {
    //             throw createError("Login failed! Please try again.");
    //         }
    //     } else {
    //         throw createError("Email already exist! Please try with another.");
    //     }
    // } catch (err) {
    //     res.status(200).json({
    //         data: {
    //             email: req.body.email,
    //         },
    //         errors: {
    //             common: {
    //                 msg: err.message,
    //             },
    //         },
    //     });
    // }
}

// send verfication code to user email
async function emailVerification(req, res, next) {
    console.log(req.auth);
    res.status(200).json({
        message: "Verification code sent to your email!",
    });
}

// verification of user
async function verify(req, res, next) {
    console.log("pin code verified");
    res.status(200).json({
        message: "Verification completed!",
    });
}

// send verfication code to user email
async function forgotPassword(req, res, next) {
    let email = req.body.email;

    if(!email) {
        res.status(401).json({
            message: "Invalid request!",
        });
    }

    let code = Math.floor(100000 + Math.random() * 900000);

    const user = await User.findOne({ email: email });
    
    if (!user) {
        throw createError("Invalid Email!");
    } else {

        // update user info

        await sendMail({
            to: email,
            subject: "Email verification",
            text: `<h1>Hi there, Your requested email verfication code is <code>${code}</code>.</h1>`
        });
    }


    res.status(200).json({
        message: "A verification code sent to your email! Please check and verify your email.",
    });
}

// verification of user
async function verifyEmail(req, res, next) {
    let email = req.body.email;
    let code = req.body.code;

    if(!email || !code) {
        res.status(401).json({
            message: "Verification Failed!",
        });
    }
    
    res.status(200).json({
        message: "Verification completed!",
    });
}

// verification of user
async function updatePassword(req, res, next) {
    console.log("password reset completed");
    res.status(200).json({
        message: "Verification completed!",
    });
}

// verification of user
async function updateProfile(req, res, next) {
    console.log("password reset completed");
    res.status(200).json({
        message: "Verification completed!",
    });
}

// do logout
function logout(req, res) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.send("logged out");
}

module.exports = {
    login,
    register,
    logout,
    me,
    emailVerification,
    verify,
    forgotPassword,
    verifyEmail,
    updatePassword,
    updateProfile
};