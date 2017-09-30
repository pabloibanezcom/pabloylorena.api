// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
const guestSchema = mongoose.Schema({
    invitationGuid: String,
    name: String,
    fullName: String,
    type: Number,
    email: String,
    isAllergic: Boolean,
    allergies: String,
    busTime: String,
    tableNumber: Number,
    isAttending: Boolean
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Guest', guestSchema);