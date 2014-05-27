'use strict';

var db = require('../models'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {

    console.log("loading create user req.body: \n" + req.body+"\n" + req.param('email')+"\n" +req.param('name')+"\n"+req.param('password'));
    db.User.create({ email: req.param('email'), name: req.param('name'), hashedPassword: req.param('password')})
        .success(function (newUser) {
            req.logIn(newUser, function (err) {
                if (err) return next(err);

                return res.json(req.user.userInfo);
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

                    res.send(200);
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