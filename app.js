const express = require('express')
const app = express()
const mongoose = require('mongoose') // 載入 mongoose

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
  res.send('hello world!')
})

app.listen(3000, () => {
  console.log('App is running!')
})