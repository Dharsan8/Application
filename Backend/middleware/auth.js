const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthMiddleWare = function (req,res,next){
    const token = req.header("Authorization");
    if (!token){
        return res.status(401).json({error : "Access Denied"});
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_KEY);
        if (verified.email !== process.env.ADMIN_EMAIL){
            return res.status(403).json({error : "Unauthorized"});
        }
        req.user = verified;
        next();
    }catch (error){
        res.status(400).json({error : "Token is invalid"});
    }
}

module.exports = AuthMiddleWare;