var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var UserRoute = require('./routes/User');
var ValidationRoute = require('./routes/UserValidation');
require('dotenv/config');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/ManageUser',  UserRoute);
app.use('/', ValidationRoute);

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser : true, useUnifiedTopology: true}, () => {
    console.log("Connected to DB");
});

app.listen(5000);


