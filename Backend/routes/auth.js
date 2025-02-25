const express = require('express');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const router = express.Router();

router.post("/login",(req,res)=>{
    const {email, password} = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS){
        const token = jwt.sign({email},process.env.JWT_KEY,{expiresIn:"1h"});
        return res.json({success:true, message:"Loggined Successfully",token});
    }
    return res.status(401).json({success:false, message:"Incorrect id or pass"});
});

module.exports = router;