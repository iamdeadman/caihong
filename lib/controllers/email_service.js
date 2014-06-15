var config = require('../config/config');
var nodemailer = require("nodemailer");
var ns = require("nodemailer-strategies");

var transport;

var smtp = nodemailer.createTransport('SMTP', {
		service: 'Mailgun',
		auth: {
		user: config.mailgun.user,
		pass: config.mailgun.password
		}
});
transport = new ns([
		{name:"console"},
		{name:'nodemailer', options:smtp}
]);

module.exports = transport; 