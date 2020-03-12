var express = require('express');
var User = require('../models/User');
var jwtAuthValidation = require('./jwtAuth');
var jwt = require('jsonwebtoken');
require('dotenv/config');

var router = express.Router();

router.get('/get', jwtAuthValidation, async (req, res)=>{
    try
    {
    const users = await User.find();
    res.json(users);
    }
    catch(err){
        res.status(400).json({message: 'Error while reading the Users. Exception is '+ err });
    }
});

router.post('/save', jwtAuthValidation, async  (req, res) =>{
    try
    {
        const authData = jwt.verify(req.token, process.env.JWT_PRIVATE_KEY, (err, authData) => {

            if(err){
                res.sendStatus(403);
            }
            else{
                return authData;
            }
        });
        const userData = new User({
            FirstName: req.body.FirstName,
            MiddleName: req.body.MiddleName,
            LastName: req.body.LastName,
            PhoneNumber: req.body.PhoneNumber,
            EmailId : req.body.EmailId,
            UserName: req.body.UserName,
            Password: req.body.Password,
            CreatedBy: authData.user._id,
            UpdatedBy : "",
            UpdatedDateTime : ""
        })
            
        const saveUser = await userData.save();
        res.status(200).json(saveUser);
    }
    catch(err){
        res.status(400).json({message: 'Error while saving the user. Exception is '+ err });   
    }
});

router.put('/update', jwtAuthValidation, async (req, res) =>{
    const authData = jwt.verify(req.token, process.env.JWT_PRIVATE_KEY, (err, authData) => {

        if(err){
            res.sendStatus(403);
        }
        else{
            return authData;
        }
    });
    try{
        const updateUser = await User.updateOne({_id: req.body._id}, {$set: {FirstName: req.body.FirstName,MiddleName: req.body.MiddleName,LastName: req.body.LastName,PhoneNumber: req.body.PhoneNumber,EmailId : req.body.EmailId,UserName: req.body.UserName,Password: req.body.Password,UpdatedBy : authData.user._id,UpdatedDateTime : null}});
        res.status(200).json(updateUser);
    }
    catch(err){
        res.status(400).json({message: 'Error while updating the user. Exception is '+err});
    }
});

router.delete('/delete', jwtAuthValidation, async (req, res) =>{
    const authData = jwt.verify(req.token, process.env.JWT_PRIVATE_KEY, (err, authData) => {
        if(err){
            res.sendStatus(403);
        }
        else{
            return authData;
        }
    });
    try{
        const deletedUser = await User.remove({_id: req.body._id});
        res.status(200).json(deletedUser);
    }
    catch(err){
        res.status(400).json({message: 'Error while updating the user. Exception is '+err});
    }
});


module.exports = router;