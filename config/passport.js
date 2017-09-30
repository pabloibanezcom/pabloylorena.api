// load all the things we need
var FacebookTokenStrategy = require('passport-facebook-token');

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use('facebook-token', new FacebookTokenStrategy({
        clientID: process.env.FB_APP_KEY,
        clientSecret: process.env.FB_APP_SECRET
    },
        function (accessToken, refreshToken, profile, done) {

            User.find({}, (err, users) => {
                var authorizedUser;
                users.forEach(function (user) {
                    if (user._doc.facebookId === profile.id + '') {
                        authorizedUser = user._doc;
                    }
                });
                if (authorizedUser === undefined) {
                    createNewUser(profile);
                    authorizedUser = true;
                }
                return done(null, authorizedUser);
            });
        }
    ));

    passport.use('admin', new FacebookTokenStrategy({
        clientID: process.env.FB_APP_KEY,
        clientSecret: process.env.FB_APP_SECRET
    },
        function (accessToken, refreshToken, profile, done) {
            var isAdmin = false;
            User.find({}, function (err, users) {
                users.forEach(function (user) {
                    if (user._doc.facebookId === profile.id) {
                        isAdmin = user._doc.isAdmin;
                    }
                });
                return done(null, isAdmin);
            });
        }
    ));

    var createNewUser = function (profile) {
        var newUser = new User({
            name: profile.displayName,
            photo: profile.photos[0].value,
            facebookId: profile.id,
            authorised: false,
            registrationDate: new Date(),
            lastAccessDate: new Date()
        });
        newUser.save(function (err) {
            if (err) return handleError(err);
        });
    }

};