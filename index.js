const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

require('./sockets')(io)
const bodyParser = require("body-parser")
const routes = require('./routes')(io)
const cors = require('cors')
const port = process.env.PORT || 4000

app.use(cors({
  // credentials: true,
  // origin: 'http://localhost:3000',
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

server.listen(port, function() {
})

app.use('/', routes)
