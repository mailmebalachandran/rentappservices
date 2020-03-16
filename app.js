var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var userRoute = require('./routes/index');
var validationRoute = require('./routes/UserValidation');
require('dotenv/config');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/userService',  userRoute);
app.use('/', validationRoute);

if(process.env.NODE_ENV === 'test'){
    const Mockgoose = require('mockgoose').Mockgoose;
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage()
        .then(() => {
            mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser : true, useUnifiedTopology: true}, () => {
                console.log("Connected to Mock DB");
            });
        })
}
else
{
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser : true, useUnifiedTopology: true}, () => {
    console.log("Connected to DB");
});
}

app.listen(5000);
console.log("Listening to the port 5000");
module.exports = app;


