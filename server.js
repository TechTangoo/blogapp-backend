const express = require('express');
const dotenv = require('dotenv').config();
const connectionDb = require('./database/db')

const app = express();
const port = process.env.PORT || 5000;
connectionDb();

app.use(express.json());

app.use('/api/blog', require("./router/blogRoute"));
app.use('/api/user', require("./router/userRoute"));

app.listen(port, () => {
    console.log(`listening on ${port}`)
})