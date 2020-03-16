const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

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
        const authData = jwt.decode(req.headers['authorization'].split(' ')[1]);
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
        const checkUser = await userService.checkUserAlreadyExists(userData.EmailId, userData.UserName, userData.PhoneNumber);
        console.log(checkUser);
        if(checkUser === undefined || checkUser === null)
        {
            console.log(userData);
            const savedUser = await userService.saveUser(userData)
            res.status(200).send(savedUser);
        }
        else{
            res.status(400).send({message: "The emailId, userName and phoneNumber is aready exists."});
        }
    }
    catch (err) {
        res.status(400).send({ message: 'Error while saving the user. Exception is ' + err });
    }
});

const updateUser = (async (req, res) => {
    
    try {
        const authData = jwt.decode(req.headers['authorization'].split(' ')[1]);
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
        const updatedUser = await userService.updateUser(userData);
        res.status(200).send(updatedUser);
    }
    catch (err) {
        res.status(400).json({ message: 'Error while updating the user. Exception is ' + err });
    }
});

const deleteUser = (async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.body._id)
        res.status(200).send(deletedUser);
    }
    catch (err) {
        res.status(400).json({ message: 'Error while updating the user. Exception is ' + err });
    }
});

const authenticateUser = async (req, res) => {
    try {
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