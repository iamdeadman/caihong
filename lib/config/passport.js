'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('../models');

/**
 * Passport configuration
 */
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    db.User.find({
        where: {_id: id},
        attributes: [name, email]
    }, function (err, user) { // don't ever give out the password or salt
        done(err, user);
    });
});

// add other strategies for more authentication flexibility
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    },
    function (email, password, done) {
        db.User.find({where:{
            email: email.toLowerCase()

        }})
            .success(function (user) {
                if (!user) {
                    return done(null, false, {
                        message: 'This email is not registered.'
                    });
                }
                if (!user.confirmed){
                    return done(null, false, {
                        message: 'Please check your email for the confirmation email.'
                    });
                }
                if (!user.Model.authenticate.call(user,password)) {
                    return done(null, false, {
                        message: 'This password is not correct.'
                    });
                }
                return done(null, user);
            })
            .error(function (err) {
                if (err) return done(err);
            });
    }
));

module.exports = passport;
