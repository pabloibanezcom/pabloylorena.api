module.exports = (app, passport) => {
    require('./routes/group.js')(app, passport);
    require('./routes/invitation.js')(app, passport);
    require('./routes/guest.js')(app, passport);
    require('./routes/generation.js')(app, passport);
    require('./routes/user.js')(app, passport);
};
