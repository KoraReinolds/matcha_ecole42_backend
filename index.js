const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    credentials: true,
  }
})

const bodyParser = require("body-parser")
const routes = require('./routes')
const cors = require('cors')
const port = process.env.PORT || 4000

app.use(cors({
  credentials: true,
  origin: '*',
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('io', io)
app.use('/', routes)

server.listen(port)