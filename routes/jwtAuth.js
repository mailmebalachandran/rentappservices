const express = require('express');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) =>{
    const bearerHeader = req.headers['authorisation'];
    if(bearerHeader !== undefined){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403).json({message: "Authentication failed"});
    }
}

module.exports = verifyToken;