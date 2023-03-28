const express = require('express');
const router = express.Router();
const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');
const validateToken = require('./../validatetoken');

router.use(validateToken)

//@description get all blogs
//@router GET /api/blogs
//access public
router.route('/').get(async (req, res) => {
    const blogs = await Blog.find()
    res.json(blogs);
})

//@description get all blogs
//@router GET /api/blogs
//access public
router.route('/allblogs/:userid').get(async (req, res) => {
    const blogs = await Blog.find({"authorid": req.params.userid})
    res.json(blogs);
})

//@description get blog by id
//@router GET /api/blogs/:id
//access public
router.route('/:id').get(async (req, res) => {
    const blogs = await Blog.findById(req.params.id);
    if (!blogs)
        return (res.json({ status: 0, message: 'No Blog found' }))
    res.json(blogs)
})

//@description get all blogs by categorey name
//@router GET /api/blogs/categorey/:categorey
//access public
router.route('/categorey/:categorey').get(async (req, res) => {
    const blogs = await Blog.find({ 'categories': {$all: [req.params.categorey]} })
    res.json(blogs);
})

//@description get all comments related to that blog
//@router GET /api/blogs/comment/:blogid
//access public
router.route('/comment/:blogid').get(async (req, res) => {
    const comments = await Comment.find({ 'blogid': req.params.blogid });
    if (!comments)
        return (res.json({ status: 0, message: 'No Blog found' }))
    res.json(comments)
})


//-------------------------------------------------------------------------------------------------------------------


//@description Create new blog
//@router POST /api/blog/create
//access public
router.route('/create').post(async (req, res) => {
    console.log("this is body: ", req.body)
    const { title, description, categories, authorid, image} = req.body;
    if (!title || !description || !categories || !authorid || !image)
        return (res.json({ status: 0, message: "All fields are required" }))

    const blogs = await Blog.create({
        title,
        description,
        categories,
        authorid,
        image
    })
    res.json(blogs)
})

//@description Create new comment for that blog
//@router POST /api/comment/:blogid
//access public
router.route('/comment/:blogid').post(async (req, res) => {
    const blogs = await Blog.findById(req.params.blogid)
    // console.log("this is body: ", req.body)
    // console.log(blogs.id)
    const { name, description, img, email } = req.body;
    if (!name || !description || !img || !email)
        return (res.json({ status: 0, message: "All fields are required" }))

    const comment = await Comment.create({
        name,
        description,
        img,
        email,
        blogid: blogs.id
    })
    res.json(comment)
})


 //-----------------------------------------------------------------------------------------------------------------


//@description Update blog details by id
//@router PUT /api/blog/:id
//access public
router.route('/:id').put(async (req, res) => {
    const blogs = await Blog.findById(req.params.id);
    if (!blogs)
        return (res.json({ status: 0, message: 'No blog found' }))

    const updated = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.json(updated)
})

//@description Update comment by its id
//@router PUT /api/blog/comment/:id
//access public
router.route('/comment/:id').put(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
        return (res.json({ status: 0, message: 'No comment found' }))

    const updated = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    const response = {
        status: 1,
        data : updated
    }
    res.json(response)
})


//-----------------------------------------------------------------------------------------------------------------------------


//@description Delete Blog by ID
//@router DELETE /api/blog/:id
//access public
router.route('/:id').delete(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
        return (res.json({ status: 0, message: 'No Blog found' }))

    await Blog.findByIdAndRemove(req.params.id);
    res.json({ status: 1, message: "Successfully Removed" })
})

//@description Delete Comment by ID
//@router DELETE /api/blog/comment/:id
//access public
router.route('/comment/:id').delete(async (req, res) => {
    const blog = await Comment.findById(req.params.id);
    if (!blog)
        return (res.json({ status: 0, message: 'No Comment found' }))

    await Comment.findByIdAndRemove(req.params.id);
    res.json({ status: 1, message: "Successfully Removed" })
})


module.exports = router;