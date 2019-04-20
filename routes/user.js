const express = require('express')
const router = express.Router()

// 登入頁面
router.get('/login', (res, req) => {
  res.render('login')
})

// 登入檢查
router.post('/login', (res, req) => {
  res.render('login')
})

// 註冊頁面
router.get('/register', (res, req) => {
  res.render('register')
})

// 註冊檢查
router.post('/register', (res, req) => {
  res.render('register')
})

// 登出
router.post('/logout', (res, req) => {
  res.render('logout')
})

module.exports = router