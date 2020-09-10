var express = require('express')
var router = express.Router()
let Room = require('../models/room')

router.post('/add_song', async function (req, res) {
    let song = req.body.song
    let roomName = req.body.roomName
    let room = await Room.findOne({ name: roomName }).exec()
    let index
    const found = room.song_queue.find((curSong, i) => {
        if (curSong.uri == song.uri) {
            index = i
            return true
        }
    })
    if (found) {
        room.song_queue[index].likes++
    } else {
        room.song_queue.push({
            name: song.title,
            uri: song.uri,
            length: song.length,
            likes: 0,
        })
    }
    console.log('UPDATED ROOM', roomName)
    room.save()
    req.app.get('io').to(roomName).emit('queue_update', song)
    res.json({ ok: true, message: 'song added' })
})

module.exports = router
