var express = require('express')
var router = express.Router()
let Room = require('../models/room')

router.post('/change_like', async function (req, res) {
    let songTitle = req.body.songTitle
    let roomName = req.body.roomName || 'test1'

    let room = await Room.findOne({ name: roomName }).exec()
    let changeVal = req.body.changeByTwo ? 2 : 1
    room.song_queue.find((curSong, i) => {
        if (songTitle === curSong.title) {
            req.body.isLike
                ? (room.song_queue[i].likes += changeVal)
                : (room.song_queue[i].likes -= changeVal)
            room.save()
            console.log(room.song_queue[i])
            req.app.get('io').to(roomName).emit('changeLike', curSong)
            res.json({ ok: true, message: 'Like Changed' })
            return
        }
    })
    return
})

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
        req.app.get('io').to(roomName).emit('changeLike', formattedSong)
        // console.log(room)
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
        req.app.get('io').to(roomName).emit('queue_update', formattedSong)
        res.json({ ok: true, message: 'song added' })
        return
    }
    // console.log('UPDATED ROOM')
    // console.log(room)
})

router.post('/get_current_song', async function (req, res) {
    let roomName = req.body.room
    let room = await Room.findOne({ name: roomName }).exec()
    if (!room.currently_playing) {
        res.json({})
    } else {
        res.json(room.currently_playing)
    }
})

router.post('/get_current_device', async function(req, res) {
    let roomName = req.body.room
    let room = await Room.findOne({ name: roomName }).exec()
    if (room.device_id){
        res.json({
            found: true,
            deviceName: room.device_name,
        })
    } else {
        res.json({ found: false })
    }
})

router.delete('/delete_room', async function(req, res) {
    let roomName = req.body.room
    await Room.deleteOne({ name: roomName }).exec()
    req.app.get('io').to(roomName).emit('roomDeleted')
    res.json({})
})

module.exports = router
