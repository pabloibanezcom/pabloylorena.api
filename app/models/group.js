// load the things we need
const mongoose = require('mongoose');

// define the schema for our user model
const groupSchema = mongoose.Schema({
    name: String,
    host: String,
    order: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Group', groupSchema);