const User = require('../models/User');

const getUsers = async () => {
    try {
        const users = await User.find();
        console.log(users)
        return users;
    }
    catch(err) {
        throw err;
    }
}

const saveUser = async (user) => {
    try {
        const userData = new User(user);
        const savedUser = await userData.save();
        return savedUser;
    }
    catch(err) {
        throw err;
    }
}

const updateUser = async (user) => {
    try {
        const updatedUser = await User.updateOne({ _id: user._id }, { $set: { FirstName: user.FirstName, MiddleName: user.MiddleName, LastName: user.LastName, PhoneNumber: user.PhoneNumber, EmailId: user.EmailId, UserName: user.UserName, Password: user.Password, UpdatedBy: user.UpdatedBy } });
        return updatedUser;
    }
    catch(err) {
        throw err;
    }
}

const deleteUser = async (_id) => {
    try {
        const deletedUser = await User.remove({ _id });
        return deletedUser;
    }
    catch(err) {
        throw err;
    }
}

const authenticateUser = async (userName, password) => {
    try {
        console.log(userName);
        const user = await User.findOne({ UserName: userName })
        console.log(user);
        return user;
    }
    catch(err) {
        throw err;
    }
}


module.exports = {
    getUsers,
    saveUser,
    updateUser,
    deleteUser,
    authenticateUser
}