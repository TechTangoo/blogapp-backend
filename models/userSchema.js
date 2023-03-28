const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add name of commenter"]
    },
    email: {
        type: String,
        required: [true, "Please add email"],
        unique: [true, "email should be unique"]
    },
    img: {
        type: String,
        required: [true, "Please add image"]
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please add email"]
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('user', UserSchema)