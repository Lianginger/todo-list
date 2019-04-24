const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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
  passport.use(new FacebookStrategy({
    clientID: '426450784852611',
    clientSecret: '0cfbabe43fd29e6d2f256dd75ae5ff32',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['displayName', 'photos', 'email']
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile._json.email })
        .then(user => {
          // 如果 email 不存在就建立新的使用者
          console.log(profile)
          console.log(profile._json)
          console.log(profile._raw)
          if (!user) {
            // 因為密碼是必填欄位，所以我們可以幫使用者隨機產生一組密碼，然後用 bcrypt 處理，再儲存起來
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt.genSalt(10, function (err, salt) {
              bcrypt.hash(randomPassword, salt, function (err, hash) {
                // Store hash in your password DB.
                const newUser = User({
                  name: profile._json.name,
                  email: profile._json.email,
                  password: hash
                })
                newUser.save().then(user => {
                  return done(null, user)
                }).catch(err => { console.log(err) })
              })
            })
          } else {
            return done(null, user)
          }
        })
    }
  ))
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


