var express = require('express')
var router = express.Router()
let Room = require('../models/room')

// Endpoint to handle song likes/dislikes
router.post('/change_like', async function (req, res) {
    let songTitle = req.body.songTitle
    let roomName = req.body.roomName

    let room = await Room.findOne({ name: roomName }).exec()
    let changeVal = req.body.changeByTwo ? 2 : 1
    room.song_queue.find((curSong, i) => {
        if (songTitle === curSong.title) {
            req.body.isLike
                ? (room.song_queue[i].likes += changeVal)
                : (room.song_queue[i].likes -= changeVal)
            room.save()
            // Send signal to update client side like display
            req.app.get('io').to(roomName).emit('changeLike', curSong, req.body.isLike)
            res.json({ ok: true, message: 'Like Changed' })
            return
        }
    })
    return
})

// Add a song to a room's queue
router.post('/add_song', async function (req, res) {
    let song = req.body.song
    let roomName = req.body.roomName
    let room = await Room.findOne({ name: roomName }).exec()
    let index
    let formattedSong
    const found = room.song_queue.find((curSong, i) => {
        if (curSong.uri == song.uri) {
            index = i
            return true
        }
    })
    if (found) {
        room.song_queue[index].likes++
        formattedSong = room.song_queue[index]
        room.save()
        req.app.get('io').to(roomName).emit('changeLike', formattedSong, null)
        res.json({ ok: true, message: 'Increment like' })
        return
    } else {
        formattedSong = {
            title: song.title,
            artist: song.description,
            uri: song.uri,
            song_id: song.id,
            length: song.length,
            likes: 0,
            image: song.image,
        }
        room.song_queue.push(formattedSong)
        room.save()
        req.app.get('io').to(roomName).emit('queueUpdate', formattedSong)
        res.json({ ok: true, message: 'song added' })
        return
    }
})

// Fetch current song in room
router.post('/get_current_song', async function (req, res) {
    let roomName = req.body.room
    let room = await Room.findOne({ name: roomName }).exec()
    if (!room.currently_playing) {
        res.json({})
    } else {
        res.json(room.currently_playing)
    }
})

// Fetch current device in room
router.post('/get_current_device', async function(req, res) {
    let roomName = req.body.room
    let room = await Room.findOne({ name: roomName }).exec()
    if (room && room.device_id){
        res.json({
            found: true,
            deviceName: room.device_name,
        })
    } else {
        res.json({ found: false })
    }
})

// Delete room, triggered after host leaves room
router.delete('/delete_room', async function(req, res) {
    let roomName = req.body.room
    await Room.deleteOne({ name: roomName }).exec()
    req.app.get('io').to(roomName).emit('roomDeleted')
    res.json({})
})

// Fetch songs in a room's queue
router.post('/get_room_songs', async function (req, res) {
    let roomName = req.body.roomName
    let room = await Room.findOne({ name: roomName }).exec()
    if (!room){
        res.json({ ok: false })
        return
    }
    let songs = room.song_queue
    res.json({ ok: true, queue: songs })
})

module.exports = router
