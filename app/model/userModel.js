const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        // mobile: {
        //   type: String,
        //   required: true,
        // },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: null
        },
        emailVerifiedAt: {
            type: String,
            default: null
        },
        secret: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: ["super-admin", "admin", "moderator", "user"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;