var config = require('../config/config');
var nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport('SMTP', {
  service: 'Mailgun',
  auth: {
    user: config.mailgun.user,
    pass: config.mailgun.password
  }
});