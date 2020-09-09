var socketio = require('socket.io')
const Room = require('./models/room')

function connectSocket(server) {
    io = socketio(server)
    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id)

        // Disconnect
        socket.on('disconnect', () => {
            console.log(socket.id, 'disconnected')
        })

        // Before disconnect, rooms still visible
        socket.on('disconnecting', () => {
            for (const room in socket.rooms) {
                if (room == socket.id) {
                    continue
                }
                console.log(socket.id, 'is leaving', room)
                // TODO: Check if room is empty, delete if true
            }
        })

        // Join Room
        socket.on('request join', async (roomName, callback) => {
            if (roomName == '') {
                callback(false, 'Invalid room name')
            } else if (Object.keys(socket.rooms).length > 1) {
                callback(false, 'Already in room')
            } else {
                let existing = await Room.findOne({ name: roomName }).exec()
                if (!existing) {
                    callback(false, "Room doesn't exist")
                } else {
                    socket.join(roomName)
                    io.sockets
                        .in(roomName)
                        .emit('joinedRoom', 'Someone has joined the room')
                    callback(true, 'Joined ' + roomName)
                }
            }
        })

        // Leave Room
        socket.on('request leave', (roomName, callback) => {
            console.log(socket.id, 'is leaving', roomName)
            socket.leave(roomName)
            if (callback) {
                callback(true, 'Left ' + roomName)
            }
        })

        // Chat feature (testing purposes)
        socket.on('chat message', (msg, room) => {
            console.log(socket.rooms)
            io.to(room).emit('chat message', msg)
        })
    })
    return io
}

module.exports = connectSocket
