'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: 'mongodb://localhost/fullstack-dev'
  },
  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox72820.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '11npp350rht0'
  },
};