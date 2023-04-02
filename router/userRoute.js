const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/userSchema');
const validateToken = require('../validatetoken');


//@description get user details by id
//@router GET /api/user/:id
//access private
router.route('/:id').get(validateToken, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.json({status: 1, data: user })
    } else {
        res.json({status: 0, message: "user not found"})
    }
})

//@description login credentials
//@router GET /api/user/login
//access public
router.route('/login').post(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return (res.json({status: 0, message: "Please enter all details"}))
    }

    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        const accesstoken = JWT.sign({
            user: {
                username: user.name,
                email: user.email,
                id: user.id
            }
        }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '45m'
        })
        return res.json({status: 1, data:{ accesstoken: accesstoken, id: user.id, name: user.name, email: user.email}})
    } else {
        return res.json({status: 0, message: "Invalid email or password"})
    }
})

//@description Create new user
//@router POST /api/blog/create
//access public
router.route('/create').post(async (req, res) => {
    console.log("this is body: ", req.body)
    const check = await User.findOne({ "email": req.body.email })
    //console.log("check: ", check)
    if (check)
        return (res.json({ status: 0, message: "User already exists" }))

    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return (res.json({ status: 0, message: "All fields are required" }))

    const hash = await bcrypt.hash(password, 10)
    //console.log(hash);

    const user = await User.create({
        name,
        email,
        password: hash
    })
    return res.json({ status: 1, data: { _id: user.id, name: user.name, email: user.email } })
})


//@description Update User by ID
//@router PUT /api/user/:id
//access public
router.route('/:id').put(validateToken, async (req, res) => {
    const users = await User.findById(req.params.id);
    if (!users)
        return (res.json({ status: 0, message: 'No User found' }))
    
    const { name, password, img, bio } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const reqbody = {
        name: name,
        password: hash,
        img: img,
        bio: bio,
    }

    const updated = await User.findByIdAndUpdate(
        req.params.id,
        reqbody,
        { new: true }
    )
    res.json({ status: 1, data: { _id: updated.id, name: updated.name, img: updated.img, bio: updated.bio } })
})


//@description Delete User by ID
//@router DELETE /api/user/:id
//access public
router.route('/:id').delete(validateToken, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return (res.json({ status: 0, message: 'No User found' }))

    await User.findByIdAndRemove(req.params.id);
    res.json({ status: 1, message: "Successfully Removed" })
})

module.exports = router;