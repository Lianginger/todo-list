const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = (() => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
  },
    // LocalStrategy 預設是從 req.body 和 req.query 找變數
    function (email, password, done) {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            console.log('Incorrect Email.')
            return done(null, false, { message: 'That email is not registered' })
          }
          // 第一個 password 來自 req.body
          // 第二個 user.password 來自 database
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err
            if (isMatch) {
              return done(null, user)
            } else {
              console.log('Incorrect password.')
              return done(null, false, { message: 'Incorrect password.' })
            }
          })
        })
    }
  ));
  // 為了要支援 session 功能，Passport 提供 serialize 與 deserialize 
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
})()


