'use strict';

var db = require('../models'),
    passport = require('passport'),
    email_service = require('./email_service');

/**
 * Create user
 */
exports.create = function (req, res, next) {

    console.log("loading create user req.body: \n" + req.body+"\n" 
        + req.param('email')+"\n" +req.param('name')+"\n"+req.param('password'));
    
    db.User.create({ email: req.param('email'), name: req.param('name'), 
        hashedPassword: req.param('password'), emailToken: req.param('email')})

        .success(function (newUser) {

            // send a confirmation email
            var body = "Here's your link - http://localhost:9000/email_confirm/" + newUser.emailToken;
            console.log(body);

            var mailOptions = {
                to: newUser.email,
                from: 'daniel.arrizza@gmail.com',
                subject: 'Welcome! Please confirm your email address',
                text: body
            };

            email_service.sendMail(mailOptions, function(err) {
                if (err) {
                  // req.flash('errors', { msg: err.message });
                  return res.json(400, err);
                  // return res.redirect('/contact');
                }
                req.logIn(newUser, function (err) {
                    if (err) return next(err);

                    return res.json(req.user.userInfo);
                });
                // req.flash('success', { msg: 'Email has been sent successfully!' });
                // res.redirect('/');
            });

            
        })
        .error(function (err){
            console.error('error');
            return res.json(400, err)
        })
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    User.find(userId)
        .success(function (user) {
            if (!user) return res.send(404);
            res.send({ profile: user.profile });
        })
        .error(function (err) {
            return next(err);
        });
};

/**
 * Change password
 */
exports.changePassword = function (req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    db.User.find(userId).success(function (user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function (err) {
                if (err)
                    return res.send(200);
            });
        } else {
            res.send(403);
        }
    })
        .error(function (err) {
            return res.send(400);
        });
};

/**
 * Get current user
 */
exports.me = function (req, res) {
    res.json(req.user || null);
};

exports.email_confirm = function (req, res, next) {
    var token = req.params[0];
    console.log('in email_confirm:' + token);
    db.User.find({where: {emailToken: token}})
        .success(function (user) {
            if (!user) {
                console.log('cannot find the user');
                return res.send(200);
            }
            console.log('success'+user);
            user.confirmed = true;
            user.emailToken = "";
            user.save()
                .success(function (){
                    console.log('saved:' +err);
                    if (err){
                        console.log('err save');
                        return res.send(200);
                    }   
                    console.log('insave');
                    req.logIn(user, function (err) {
                        return res.send(200);
                        // return res.json(req.user.userInfo);
                    })
                    
                })
                .error(function (err) {
                    return res.send(200);
                });; 
        })
        .error(function (err) {
            console.log('naw')
            return res.send(400);
        });
};