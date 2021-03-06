const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入檢查
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email }).then((user) => {
    if (user) {
      console.log('User already exists')
      const errorMessage = 'User already exists'
      res.render('register', { name, email, errorMessage })
    } else {
      const newUser = new User(req.body)
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          // Store hash in your password DB.
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then((user) => {
              res.redirect('/')
            })
            .catch((err) => console.log(err))
        });
      });

    }
  })
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router