const mongoose = require('mongoose');
const CommentSchema = require("./commentSchema")

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add title"]
    },
    description: {
        type: String,
        required: [true, "Please add description"]
    },
    categories: {
        type: [String],
        required: [true, "Please add category"]
    },
    likes: {
        type: [String],
        unique: [true, "only one like by one user"]
    },
    authorid: {
        type: String,
        required: [true, "Please add authorid"]
    },
    image: {
        type: String,
        required: [true, "Please add image"]
    }

}, {
    timestamps: true,
})

module.exports = mongoose.model('blog', BlogSchema)