const express = require('express')
const router = express.Router()
const User = require('../models/user')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入檢查
router.post('/login', (req, res) => {
  res.render('login')
})

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
      newUser.save()
        .then((user) => {
          res.redirect('/')
        })
        .catch((err) => console.log(err))
    }
  })
})

// 登出
router.post('/logout', (req, res) => {

  res.render('logout')
})

module.exports = router