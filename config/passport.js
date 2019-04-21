const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = (() => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
  },
    function (email, password, done) {
      User.findOne({ email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          console.log('Incorrect Email.')
          return done(null, false, { message: 'Incorrect Email.' });
        }
        if (user.password != password) {
          console.log('Incorrect password.')
          return done(null, false, { message: 'Incorrect password.' });
        }
        console.log('Welcome')
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
})()


