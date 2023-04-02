const mongoose = require('mongoose');

const connectionDb = async () => {

    try {
        const connect = await mongoose.connect(process.env.CONNECTION);
        console.log("Database connected: ", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.log('error in db connectiion. Error: ', err)
        process.exit(1)
    }
}

module.exports = connectionDb;