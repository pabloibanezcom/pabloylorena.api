// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
const groupSchema = mongoose.Schema({
    name: String,
    host: String,
    order: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Group', groupSchema);