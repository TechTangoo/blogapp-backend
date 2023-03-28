const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add name of commenter"]
    },
    description: {
        type: String,
        required: [true, "Please add description"]
    },
    img: {
        type: String,
        required: [true, "Please add image"]
    },
    likes: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Please add email"]
    },
    blogid: {
        type: String,
        required: [true, "Please add blogid"]
    }

}, {
    timestamps: true,
})

module.exports = mongoose.model('comment', CommentSchema)