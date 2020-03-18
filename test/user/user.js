const expect = require('chai').expect;
const request = require('supertest');
let { verifyToken } = require('../../routes/jwtAuth');
const User = require('../../models/User');

const app = require('../../app');
let token;
let getUpdatedUser;

let defaultUser = {
        FirstName:"Geetha",
        MiddleName:"",
        LastName: "Balachandran",
        PhoneNumber: "7358529473",
        EmailId: "bgeetha2514@gmail.com",
        UserName: "geetha",
        Password: "nullvoid",
        CreatedBy: "Admin"
}

let updatedUser = {
    _id: "",
    FirstName:"Geetha1",
    MiddleName:"",
    LastName: "Balachandran2",
    PhoneNumber: "73585294731",
    EmailId: "bgeetha2514@gmail.com",
    UserName: "geetha",
    Password: "nullvoid",
    CreatedBy: "Admin"
}

let saveUserId;

describe('POST /user', () =>{
    before((done) => {
           User.remove({EmailId: "bgeetha2514@gmail.com"});
            done();
    })

    it('Authenticate User ', (done) => { 
        console.log("hitted Authenticate User");
         request(app)
                    .post('/userService/authenticateUser')
                    .send({ UserName: "balachandran", Password: "nullvoid" })
                    .then((res) => {
                        const body = res.body;
                        token = body.token;
                        done();  
                    })
                    .catch((err) => done(err));
    });

    it('OK, creating a new user', function(done) {
        request(app).post('/userService/saveUser') 
            .send(defaultUser)
            .set('authorization', 'bearer ' + token)
            .then((res) => {
                const body = res.body;
                saveUserId = body._id;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('FirstName');
                expect(body).to.contain.property('MiddleName');
                expect(body).to.contain.property('LastName');
                expect(body).to.contain.property('PhoneNumber');
                expect(body).to.contain.property('EmailId');
                expect(body).to.contain.property('UserName');
                expect(body).to.contain.property('Password');
                done();
            })
            .catch((err) => {console.log(err);done(err);});
            
    });

    it('User Name already exists', function(done) {
        request(app).post('/userService/saveUser') 
            .send(defaultUser)
            .set('authorization', 'bearer ' +token)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('message');
                done();
            })
            .catch((err) => {console.log(err);done(err);});
            
    });

    it('Update User', function(done) {
        updatedUser._id = saveUserId;
        console.log("updated User Data : " +updatedUser);
        request(app)
            .put('/userService/updateUser') 
            .send(updatedUser)
            .set('authorization', 'bearer ' +token)
            .then((res) => {
                const body = res.body;
                console.log(body);
                expect(body).to.contain.property('_id');
                done();
            })
            .catch((err) => {console.log(err);done(err);});
            
    });

    it('Delete User', function(done) {
        request(app)
            .delete('/userService/deleteUser') 
            .send({"_id": saveUserId})
            .set('authorization', 'bearer ' +token)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('deletedCount').to.eql(0);
                expect(body).to.contain.property('ok').to.eql(0);
                done();
            })
            .catch((err) => {console.log(err);done(err);});
            
    });
});