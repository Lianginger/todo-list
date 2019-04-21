const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  Todo.find()
    .sort({ name: 'asc' })
    .exec((err, todos) => { // 把 Todo model 所有的資料都抓回來
      return res.render('index', { todos: todos })
    })
})


module.exports = router