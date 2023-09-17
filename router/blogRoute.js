const express = require('express');
const router = express.Router();
const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');
const validateToken = require('./../validatetoken');


//@description get all blogs
//@router GET /api/blogs
//access public
router.route('/').get(async (req, res) => {
    const blogs = await Blog.find()
    res.status(200).json({ status: 1, data: blogs });
})

//@description get all blogs of that user
//@router GET /api/blogs/:userid
//access private
router.route('/allblogs/:userid').get(validateToken, async (req, res) => {
    const blogs = await Blog.find({ "authorid": req.params.userid })
    res.status(200).json({ status: 1, data: blogs });
})

//@description get blog by id
//@router GET /api/blogs/:id
//access private
router.route('/:id').get(validateToken, async (req, res) => {
    const blogs = await Blog.findById(req.params.id);
    if (!blogs)
        return (res.status(200).json({ status: 0, message: 'No Blog found' }))
    res.status(200).json({ status: 1, data: blogs })
})

//@description get all blogs by category name
//@router GET /api/blogs/category/:category
//access public
router.route('/category/:category').get(async (req, res) => {
    const blogs = await Blog.find({ 'categories': { $all: [req.params.category] } })
    res.status(200).json({status: 1, data: blogs});
})

//@description get all comments related to that blog
//@router GET /api/blogs/comment/:blogid
//access private
router.route('/comment/:blogid').get(validateToken, async (req, res) => {
    const comments = await Comment.find({ 'blogid': req.params.blogid });
    if (!comments)
        return (res.status(200).json({ status: 0, message: 'No Blog found' }))
    res.status(200).json({status: 1, data: comments})
})


//-------------------------------------------------------------------------------------------------------------------


//@description Create new blog
//@router POST /api/blogs/create
//access private
router.route('/create').post(validateToken, async (req, res) => {
    const { title, description, categories, authorid, image } = req.body;
    if (!title || !description || !categories || !authorid || !image)
        return (res.status(200).json({ status: 0, message: "All fields are required" }))

    const blogs = await Blog.create({
        title,
        description,
        categories,
        authorid,
        image
    })
    res.status(200).json({status: 1, data: blogs})
})

//@description Create new comment for that blog
//@router POST /api/blogs/comment/:blogid
//access private
router.route('/comment/:blogid').post(validateToken, async (req, res) => {
    const blogs = await Blog.findById(req.params.blogid)
    // console.log("this is body: ", req.body)
    // console.log(blogs.id)
    const { name, description, img, email } = req.body;
    if (!name || !description || !img || !email)
        return (res.status(200).json({ status: 0, message: "All fields are required" }))

    const comment = await Comment.create({
        name,
        description,
        img,
        email,
        blogid: blogs.id
    })
    res.status(200).json({status: 1, data: comment})
})


//-----------------------------------------------------------------------------------------------------------------


//@description Update blog details by id
//@router PUT /api/blogs/:id
//access private
router.route('/:id').put(validateToken, async (req, res) => {
    const blogs = await Blog.findById(req.params.id);
    if (!blogs)
        return (res.status(200).json({ status: 0, message: 'No blog found' }))

    const updated = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.status(200).json({status: 1, data: updated})
})

//@description Update comment by its id
//@router PUT /api/blog/comment/:id
//access private
router.route('/comment/:id').put(validateToken, async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
        return (res.status(200).json({ status: 0, message: 'No comment found' }))

    const updated = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    const response = {
        status: 1,
        data: updated
    }
    res.status(200).json({status: 1, data: response})
})


//-----------------------------------------------------------------------------------------------------------------------------


//@description Delete Blog by ID
//@router DELETE /api/blogs/:id
//access private
router.route('/:id').delete(validateToken, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
        return (res.status(200).json({ status: 0, message: 'No Blog found' }))

    await Blog.findByIdAndRemove(req.params.id);
    res.status(200).json({ status: 1, message: "Successfully Removed" })
})

//@description Delete Comment by ID
//@router DELETE /api/blogs/comment/:id
//access private
router.route('/comment/:id').delete(validateToken, async (req, res) => {
    const blog = await Comment.findById(req.params.id);
    if (!blog)
        return (res.status(200).json({ status: 0, message: 'No Comment found' }))

    await Comment.findByIdAndRemove(req.params.id);
    res.status(200).json({ status: 1, message: "Successfully Removed" })
})


module.exports = router;
