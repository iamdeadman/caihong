'use strict';

var crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'];


var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("User", {
            name: {type: Sequelize.STRING},
            email: {
                type: Sequelize.STRING,
                unique: true,
                set: function (email) {
                    this.setDataValue('email', email.toLowerCase());
                },
                validate: {
                    // provider: function () {
                    //     if (authTypes.indexOf(this.provider) == -1) {
                    //         console.log("this._email" + this._email)
                    //         if (!(this._email.length > 0)) {
                    //             throw new Error('Email cannot be blank');
                    //         }
                    //     }
                    // }
                }

            },
            hashedPassword: {
                type: Sequelize.STRING,
                set: function (password) {
                    var salt = this.Model.makeSalt();
                    this.setDataValue('salt', salt);

                    var encrypted = this.Model.encryptPassword.call(this, password);
                    this.setDataValue('hashedPassword', encrypted);
                }
                // validate: { provider: function (value) {
                //     if (authTypes.indexOf(this._provider) == -1) {
                //         if (!(value.length > 0)) {
                //             throw new Error('Email cannot be blank');
                //         }
                //     }
                // }
                // }
            },
            role: {
                type: Sequelize.STRING,
                defaultValue: 'user'
            },
            provider: {type: Sequelize.STRING},
            salt: {
                type: Sequelize.STRING
            }
        },
        {
            classMethods: {
                associate: function (models) {
                    // user.hasMany(models.Task)
                },
                userInfo: function () {
                    return {
                        'name': this._name,
                        'role': this._role,
                        'provider': this._provider
                    };
                },
                profile: function () {
                    return {
                        'name': this._name,
                        'role': this._role
                    };
                },
                /**
                 * Authenticate - check if the passwords are the same
                 *
                 * @param {String} plainText
                 * @return {Boolean}
                 * @api public
                 */
                authenticate: function (plainText) {
                    return this.Model.encryptPassword.call(this, plainText) === this.hashedPassword
                },
                /**
                 * Make salt
                 *
                 * @return {String}
                 * @api public
                 */
                makeSalt: function () {
                    return crypto.randomBytes(16).toString('base64');
                },

                /**
                 * Encrypt password
                 *
                 * @param {String} password
                 * @return {String}
                 * @api public

                /**
                 */
                encryptPassword: function (password) {
                    debugger;
                    if (!password || !this.getDataValue('salt')) return '';
                    var salt = new Buffer(this.getDataValue('salt'), 'base64');
                    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
                }
            }
        },
        {
            validate: {
//                 hashed: function () {
//                     // TODO: this is important!!!! IMPLEMENT!!!
// //                    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
// //                        throw new Error('Invalid password');
//                 }
            }
        }
    )
}

//
///**
// * User Schema
// */
//var UserSchema = new Schema({
//    name: String,
//    email: { type: String, lowercase: true },
//    role: {
//        type: String,
//        default: 'user'
//    },
//    hashedPassword: String,
//    provider: String,
//    salt: String,
//    facebook: {},
//    twitter: {},
//    github: {},
//    google: {}
//});


