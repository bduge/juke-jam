var express = require('express')
var router = express.Router()
let Room = require('../models/room')

router.post('/change_like', async function(req, res){
    console.log("CHANGELIKE")
    let songTitle = req.body.songTitle
    let roomName = req.body.roomName
    let room = await Room.findOne({name: roomName}).exec()
    room.song_queue.find((curSong, i) => {
        if(songTitle === curSong.title){
            req.body.isLike ? room.song_queue[i].likes++ : room.song_queue[i].likes--
            room.save()
            req.app.get('io').to(roomName).emit('changeLike', curSong)
            res.json({ok: true, message: 'Like Changed'})
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
        req.app.get('io').to(roomName).emit('addLike', formattedSong);
        console.log(room)
        res.json({ok: true, message: 'Increment like'})
        room.save()
        return 
    } else {
        formattedSong = {
            title: song.title,
            artist: song.description, 
            uri: song.uri,
            length: song.length,
            likes: 0,
            image: song.image
        }
        room.song_queue.push(formattedSong)
    }
    console.log('UPDATED ROOM')
    console.log(room)
    room.save()
    req.app.get('io').to(roomName).emit('queue_update', formattedSong)
    res.json({ ok: true, message: 'song added' })
    return 
})


module.exports = router
