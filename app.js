const express = require('express')
const app = express()
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 3000
const methodOverride = require('method-override')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 設定連線到 mongoDB
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
// mogoose 連線後，透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection

// 異常連線
db.on('error', () => {
  console.log('mongodb error')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected')
})

// 載入 todo model
const Todo = require('./models/todo')

app.get('/', (req, res) => {
  Todo.find()
    .sort({ name: 'asc' })
    .exec((err, todos) => { // 把 Todo model 所有的資料都抓回來
      return res.render('index', { todos: todos })
    })
})

app.get('/todos', (req, res) => {
  res.send('列出所有 todo')
})

app.get('/todos/new', (req, res) => {
  res.render('new')
})

app.post('/todos', (req, res) => {
  const todo = Todo({
    name: req.body.name
  })

  todo.save((err) => {
    if (err) return console.log(err)
    return res.redirect('/')
  })
})

app.get('/todos/:id', (req, res) => {
  // req.params.id
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('detail', { todo: todo })
  })
})

app.get('/todos/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('edit', { todo: todo })
  })
})

app.put('/todos/:id', (req, res) => {
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

app.delete('/todos/:id/delete', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    todo.remove((err) => {
      res.redirect('/')
    })
  })
})

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})