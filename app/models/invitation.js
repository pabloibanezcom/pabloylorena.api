// load the things we need
const mongoose = require('mongoose');

// define the schema for our user model
const invitationSchema = mongoose.Schema({
    guid: String,
    alias: String,
    groupId: String,
    receiver: String,
    address: {
        line1: String,
        line2: String,
        line3: String,
        postalCode: String,
        town: String,
        country: String
    }, 
    isSent: Boolean
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Invitation', invitationSchema);