var express = require('express')
var router = express.Router()
let Room = require('../models/room')

router.get('/add_song', async function (req, res) {
    let song = req.body.song.json()
    let roomName = req.body.room
    let room = await Room.findOne({ name: roomName }).exec()
    let index
    const found = room.song_queue.find((curSong, i) => {
        if (curSong.uri == song.uri) {
            index = i
            return True
        }
    })
    if (found) {
        room.song_queue[index].likes++
    } else {
        room.song_queue.push({
            name: song.name,
            uri: song.uri,
            length: song.length,
            likes: 0,
        })
    }
    room.save()
    req.app.get('io').to(roomName).emit('queue_update')
})

module.exports = router
