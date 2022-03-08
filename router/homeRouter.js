const express = require("express");

const router = express.Router();

// login page
router.get("/", function (req, res, next) {
    res.status(200).json("Welcome");
});


module.exports = router;