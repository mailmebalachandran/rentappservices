const express = require('express');
const User = require('../models/User');
const jwtAuthValidation = require('./jwtAuth');
const userController = require('../controllers/userController'); 
const jwt = require('jsonwebtoken');
require('dotenv/config');

const router = express.Router();

router.get('/getUsers', userController.getUsers);
router.post('/saveUser', userController.saveUser);
router.put('/updateUser', userController.updateUser);
router.delete('/deleteUser', userController.deleteUser);
router.post('/authenticateUser', userController.authenticateUser);

module.exports = router;