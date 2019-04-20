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

app.use('/', require('./routes/home'))
app.use('/users', require('./routes/user'))
app.use('/todos', require('./routes/todos'))

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})