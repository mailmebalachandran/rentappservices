const Joi = require('joi');

const saveValidation = (body) =>{
    const schema = Joi.object().keys({
        FirstName: Joi.string().min(5).max(100).required(),
        MiddleName: Joi.string().allow('').optional(),
        LastName: Joi.string().min(5).max(100).required(),
        PhoneNumber: Joi.string().min(10).max(10).required(),
        EmailId : Joi.string().trim().email().required(),
        UserName : Joi.string().min(5).max(10).required(),
        Password: Joi.string().min(5).max(10).required()
    })
    return Joi.validate(body, schema).error
}

const deleteValidation = (body) =>{
    const schema = Joi.object().keys({
        _id:Joi.string().required()
    })
    return Joi.validate(body, schema).error
}

const authenticateValidation = (body) => {
    const schema = Joi.object().keys({
        UserName : Joi.string().required(),
        Password : Joi.string().required()
    });
    return Joi.validate(body, schema).error
}

module.exports = { saveValidation, deleteValidation, authenticateValidation };