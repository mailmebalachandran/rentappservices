const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const userValidation = require('../validation/userValidation');

const getUsers = async (req, res) => {
    try {
        const getUserData = await userService.getUsers();
        res.status(200).send(getUserData);
    }
    catch (err) {
        res.status(500).send({ message: 'Error while reading the Users. Exception is ' + err });
    }
};

const saveUser = (async (req, res) => {
    try {
        const validationResult = userValidation.saveValidation(req.body);
        if(validationResult){
            res.status(400).send({message:validationResult.details[0].messsage})
        }
        console.log(validationResult);
        const token = req.headers['authorization'];
        const authData = jwt.decode(token.split(' ')[1]);
        const {
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            EmailId,
            UserName,
            Password,
        } = req.body
        const userData ={
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            EmailId,
            UserName,
            Password,
            CreatedBy: authData.user._id,
            UpdatedBy: "",
            UpdatedDateTime:""
        }
        const checkUser = await userService.checkUserAlreadyExists(userData.UserName);
        if(checkUser === undefined || checkUser === null)
        {
            const savedUser = await userService.saveUser(userData)
            res.status(200).send(savedUser);
        }
        else{
            res.status(400).send({message: "The Username is already exists."});
        }
    }
    catch (err) {
        res.status(400).send({ message: 'Error while saving the user. Exception is ' + err });
    }
});

const updateUser = (async (req, res) => {
    try {
        const validationResult = userValidation.updateValidation(req.body);
        if(validationResult){
            res.status(400).send({message:validationResult.details[0].messsage})
        }
        
        const token = req.headers['authorization'];
        const authData = jwt.decode(token.split(' ')[1]);
        const {
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            EmailId,
            UserName,
            Password
        } = req.body
        const userData = {
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            EmailId,
            UserName,
            Password,
            UpdatedBy: authData.user._id
        }
        userData._id= req.body._id;
        const updatedUser = await userService.updateUser(userData);
        res.status(200).send(updatedUser);
    }
    catch (err) {
        res.status(400).json({ message: 'Error while updating the user. Exception is ' + err });
    }
});

const deleteUser = (async (req, res) => {
    try {
        const validationResult = userValidation.deleteValidation(req.body);
        if(validationResult != null){
            res.status(400).send({message:validationResult.details[0].message})
        }
        const deletedUser = await userService.deleteUser(req.body._id)
        res.status(200).send(deletedUser);
    }
    catch (err) {
        res.status(400).json({ message: 'Error while updating the user. Exception is ' + err });
    }
});

const authenticateUser = async (req, res) => {
    try {
        const validationResult = userValidation.authenticateValidation(req.body);
        if(validationResult != null){
            res.status(400).send({message:validationResult.details[0].message})
        }
        const user = await userService.authenticateUser(req.body.UserName, req.body.Password);
        jwt.sign({ user: user }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' }, (err, token) => {
            res.status(200).send({
                token: token
            });
        });
    }
    catch (err) {
        res.status(501).send({message :"Error in getting the user" + err});
    }

};


module.exports = {
    getUsers,
    saveUser,
    updateUser,
    deleteUser,
    authenticateUser
};