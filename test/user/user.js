const expect = require('chai').expect;
const request = require('supertest');
let { verifyToken } = require('../../routes/jwtAuth');
const User = require('../../models/User');

const app = require('../../app');
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVlNmNiMDM4OTViYmI1MmRkMDJiMGE4YSIsIkZpcnN0TmFtZSI6IkJhbGFjaGFuZHJhbiIsIk1pZGRsZU5hbWUiOiIiLCJMYXN0TmFtZSI6IkthbmFnYXN1bmRhcmFtIiwiUGhvbmVOdW1iZXIiOiI5ODk0MTMwOTY2IiwiRW1haWxJZCI6Im1haWxtZS5iYWxhY2hhbmRyYW5AZ21haWwuY29tIiwiVXNlck5hbWUiOiJiYWxhY2hhbmRyYW4iLCJQYXNzd29yZCI6Im51bGx2b2lkIiwiQ3JlYXRlZEJ5IjoiQWRtaW4iLCJVcGRhdGVkQnkiOiIiLCJVcGRhdGVkRGF0ZVRpbWUiOiIiLCJDcmVhdGVkRGF0ZVRpbWUiOiIxNTg0MTgxMzA0NzYwIiwiX192IjowfSwiaWF0IjoxNTg0MzM4ODMxLCJleHAiOjE1ODQ0MjUyMzF9.a9mD80o2pq0nTRp8fjYlFHAH7deH3OO1P1xvPWKpJn0';

const defaultUser = {
        FirstName:"Geetha",
        MiddleName:"",
        LastName: "Balachandran",
        PhoneNumber: "7358529473",
        EmailId: "bgeetha2514@gmail.com",
        UserName: "geetha",
        Password: "nullvoid",
        CreatedBy: "Admin"
}



describe('POST /user', () =>{
    before((done) => {
        console.log("Hitted");
            const UserModel = new User(defaultUser);
            UserModel.save();
            done();
    })

    it('Authenticate User ', async (done) => { 
        console.log("hitted Authenticate User");
        await request(app)
                    .post('/userService/authenticateUser')
                    .send({ UserName: "geetha", Password: "nullvoid" })
                    .expect((res) => {
                        const body = res.body;
                        token = body.token;
                        console.log(token);
                        done();     
                    })
                    .catch((err) => done(err));
    });

    it('OK, creating a new user', async(done) => { 
        console.log("hitted save User");
        await request(app).post('/userService/saveUser')
            .send({ FirstName: "Geetha", MiddleName: "", LastName: "Balachandran", PhoneNumber: "7358529473", EmailId: "bgeetha2514@gmail.com", UserName: "geetha", Password: "nullvoid" })
            .set({Authorization: 'Bearer ' +token})
            .expect((res) => {
                const body = res.body;
                console.log(body);
                expect(body).to.contain.property('message');
                done();
            })
            .catch((err) => done(err));
    });
});