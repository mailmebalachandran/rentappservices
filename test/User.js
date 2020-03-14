let mongoose = require('mongoose');
let User = require('../models/User');

let chai = require('chai');
let chaihttp = require('chai-http');
let server = require('../app');

let should = chai.should();

chai.use(chaihttp);

describe('Users', () => {
    // beforeEach((done) =>{
    //     User.remove({}, (err) =>{
    //         done();
    //     })
    // })

    describe('/Get users', () => {
        it('it should GET all the Users', (done) =>{
            chai.request('http://localhost:5000/UserService/User')
                .get('/')
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        })
    });

    describe('/Post Users', () =>{
        it('it should not POST a user without lastName', (done) =>{
            let user = {
                FirstName: "",
                MiddleName: ""
            };
            chai.request('http://localhost:5000/UserService/')
                .post('/User')
                .send(user)
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('FirstName');
                    res.body.errors.FirstName.should.have.property('kind').eql('required');
                    done();
                })
        });
    });
});