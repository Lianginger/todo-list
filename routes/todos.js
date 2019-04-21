const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
// 載入 auth middleware
const { authenticated } = require('../config/auth')

router.get('', authenticated, (req, res) => {
  res.send('列出所有 todo')
})

router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

router.post('', authenticated, (req, res) => {
  const todo = Todo({
    name: req.body.name
  })

  todo.save((err) => {
    if (err) return console.log(err)
    return res.redirect('/')
  })
})

router.get('/:id', authenticated, (req, res) => {
  // req.params.id
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('detail', { todo: todo })
  })
})

router.get('/:id/edit', authenticated, (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('edit', { todo: todo })
  })
})

router.put('/:id', authenticated, (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.name = req.body.name
    if (req.body.done === 'on') {
      todo.done = true
    } else {
      todo.done = false
    }
    todo.save((err) => {
      return res.redirect('/todos/' + todo.id)
    })
  })
})

router.delete('/:id/delete', authenticated, (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    todo.remove((err) => {
      res.redirect('/')
    })
  })
})

module.exports = router