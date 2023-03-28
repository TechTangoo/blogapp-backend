const JWT = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
        JWT.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
            if (err) {
                return res.json({ status: 0, message: "User is not authorized" })
            } else {
                req.user = decoded.user;
                next();
            }
        });
    }

    console.log("validating token : ", authHeader);


    if (!token) {
        return res.json({ status: 0, message: "User is not authorized" })
    }
}

module.exports = validateToken;