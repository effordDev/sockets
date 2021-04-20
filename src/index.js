const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoyPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoyPath))

const message = 'Welcome!'

io.on('connection', (socket) => {
    console.log('new web socket connnection')

    socket.emit('welcome', message)
    socket.broadcast.emit('welcome', 'New user has joined')

    //listeners
    socket.on('sendMessage', (message, callback) => {
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com./maps?q=${coords.lat},${coords.long}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'a user has left')
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port);
})