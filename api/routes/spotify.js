var express = require('express')
var router = express.Router()
const axios = require('axios')
const Room = require('../models/room')
require('dotenv').config()

// Gloabl timer object to set timeout while song is playing to play the next song once it ends
let global_timer

// Retrieve authorization and refresh token from backend. Store in database under room name
router.post('/get_token', async function (req, res) {
    let code = req.body.token
    let room = req.body.roomName || 'test' // Default value for testing purposes

    let roomExists = await Room.exists({ name : room})
    if (roomExists){
        res.json({
            ok: false,
            message: "exists"
        })
        return
    }

    // Set api call options for call to spotify
    const token_options = {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: 'https://accounts.spotify.com/api/token',
        params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${process.env.BASE_CLIENT_URL}/create-room`,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        },
    }
    let body
    // make spotify api call
    try {
        let response = await axios(token_options)
        body = response.data
    } catch (error) {
        console.log(error.response.data)
        res.json({ ok: false, message: 'expired' })
        return
    }

    // Get spotify id of user
    let access_token = body.access_token
    let user_id
    try {
        user_id = await get_user_id(access_token)
    } catch (error) {
        console.log(error.response.data)
        res.json({ ok: false, message: 'creation' })
        return
    }

    // Create new room
    let new_room = new Room({
        name: room,
        room_host_id: user_id,
        access_token: access_token,
        refresh_token: body.refresh_token,
        token_expiry: +new Date(Date.now() + body.expires_in * 980),
    })
    new_room.save((error, room) => {
        if (error) {
            console.log(error.response.data)
            res.json({ ok: false, message: 'creation' })
        } else {
            res.json({ ok: true, message: 'SUCCESS' })
        }
    })
})

// Get available devices associated with host's account
router.post('/get_devices', async function (req, res) {
    let room = req.body.roomName
    let token = await refresh_token(room)
    // Set api call options for call to spotify
    const device_options = {
        method: 'get',
        headers: { Authorization: 'Bearer ' + token },
        url: 'https://api.spotify.com/v1/me/player/devices',
    }
    let body

    // make spotify api call
    try {
        let response = await axios(device_options)
        body = response.data
    } catch (error) {
        console.log(error.response.data)
        res.json({ ok: false, message: error })
        return
    }

    let devices = body.devices.filter((device) => !device.is_restricted)
    res.json(
        devices.map((device) => {
            return {
                id: device.id,
                name: device.name,
                type: device.type,
            }
        })
    )
})

// Set room's active device to play music from
router.put('/update_device', async function (req, res) {
    let roomName = req.body.room
    let deviceId = req.body.deviceId
    let deviceName = req.body.deviceName
    let room = await Room.findOne({ name: roomName }).exec()
    let token = await refresh_token(roomName)
    let transfer_options = {
        method: 'put',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        url: 'https://api.spotify.com/v1/me/player',
        data: {
            device_ids: [deviceId],
        },
    }
    axios(transfer_options)
        .then(() => {
            room.device_id = deviceId
            room.device_name = deviceName
            room.save()
            res.json({ ok: true, message: 'Transfer Request sent' })
        })
        .catch((error) => {
            console.log(error.response.data)
            res.json({ ok: false, message: error })
        })
})

// Search for songs using spotify api
router.post('/search', async function (req, res) {
    let searchString = req.body.searchString
    let roomName = req.body.roomName
    let authToken = await refresh_token(roomName)
    const search_options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + authToken,
        },
        url: 'https://api.spotify.com/v1/search',
        params: {
            q: searchString,
            type: 'track',
            limit: 5,
        },
    }

    try {
        let response = await axios(search_options)
        let results = await formatSongArr(response.data.tracks.items)
        res.send(results)
    } catch (error) {
        error.response && console.log(error.response.data)
    }
})

// Play current song or next up in queue
router.put('/play', function (req, res) {
    playSong(req.body.room, req.app.get('io'), req.body.resume, res)
})

// Pause current song
router.put('/pause', async function (req, res) {
    let roomName = req.body.room
    let room = await Room.findOne({ name: roomName }).exec()
    if (!room.currently_playing) {
        res.json({ ok: true, message: 'Nothing playing' })
        return;
    }
    let access_token = await refresh_token(roomName)
    const pauseOptions = {
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/pause',
        headers: {
            Authorization: 'Bearer ' + access_token,
        },
    }
    const playingOptions = {
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player',
        headers: {
            Authorization: 'Bearer ' + access_token,
        },
    }
    let response
    try {
        response = await axios(playingOptions)
    } catch (error) {
        console.log(error.response.data)
    }

    if (!response.data.is_playing) {
        res.json({ ok: true, message: 'not playing' })
        return
    }
    // const time_remaining =
    //     response.data.item.duration_ms - response.data.progress_ms
    axios(pauseOptions)
        .then(() => {
            clearTimeout(global_timer)
            // room.currently_playing.length = time_remaining
            room.currently_playing.paused = true
            room.save()
            res.json({ ok: true, message: 'playback paused' })
        })
        .catch((error) => {
            console.log(error.response.data)
            res.json({ ok: false, message: 'pause request failed' })
        })
})

// Endpoint to verify user rejoining room matches host id
router.post('/user_id', async function(req, res) {
    let code = req.body.code
    let roomName = req.body.roomName
    let roomExists = await Room.exists({ name : roomName})
    if (!roomExists){
        res.json({ ok: false, message: 'invalid'})
        return
    }
    let room = await Room.findOne({ name: roomName }).exec()

    // Set api call options for call to spotify
    const token_options = {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: 'https://accounts.spotify.com/api/token',
        params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${process.env.BASE_CLIENT_URL}/join-room`,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        },
    }
    let body
    // make spotify api call
    try {
        let response = await axios(token_options)
        body = response.data
    } catch (error) {
        console.log(error.response.data)
        res.json({ ok: false, message: 'expired' })
        return
    }

    // Get spotify id of user
    let access_token = body.access_token
    let user_id
    try {
        user_id = await get_user_id(access_token)
    } catch (error) {
        console.log(error.response.data)
        res.json({ ok: false, message: 'denied' })
        return
    }

    if (room.room_host_id != user_id){
        res.json({ ok: false, message: 'nomatch' })
    } else {
        res.json({ ok: true, message: 'success'})
    }
})

// Get user id from spotify api
async function get_user_id(access_token) {
    const user_options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            Authorization: 'Bearer ' + access_token,
        },
    }
    let response
    try {
        response = await axios(user_options)
    } catch (error) {
        console.log(error.response.data)
        return false
    }
    let body = response.data
    return body.id
}

// Check if access token is expired and refresh if necessary
async function refresh_token(room_name) {
    let room = await Room.findOne({ name: room_name }).exec()
    let expiry_time = new Date(room.token_expiry)

    if (Date.now() > expiry_time) {
        // Access token has expired
        encoded_string = Buffer.from(
            process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        ).toString('base64')
        const refresh_options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + encoded_string,
            },
            url: 'https://accounts.spotify.com/api/token',
            params: {
                grant_type: 'refresh_token',
                refresh_token: room.refresh_token,
            },
        }
        let body
        // Make api call to refresh token
        try {
            let response = await axios(refresh_options)
            body = response.data
        } catch (error) {
            console.log(error)
            return
        }

        // Update values
        room.access_token = body.access_token
        room.token_expiry = +new Date(Date.now() + body.expires_in * 980)
        try {
            await room.save()
        } catch (error) {
            console.log(error)
        }
    }
    return room.access_token
}

// Play song
async function playSong(roomName, io, resume, client = null) {
    let room = await Room.findOne({ name: roomName }).exec()
    if (client === null && room.currently_playing.paused) {
        return
    } else if (!resume && room.song_queue.length == 0) {
        // Queue is empty, nothing to play
        io.to(roomName).emit('musicStopped')
        if (client) {
            client.json({ ok: false, message: 'empty' })
        }
        return
    }
    let authToken = await refresh_token(roomName)
    const playingOptions = {
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player',
        headers: {
            Authorization: 'Bearer ' + authToken,
        },
    }
    // Fetch spotify player's current status
    let response
    try {
        response = await axios(playingOptions)
    } catch (error) {
        console.log(error.response.data)
    }

    let song = resume
        ? room.currently_playing
        : room.song_queue.reduce((mostLiked, song) => {
              return song.likes > mostLiked.likes ? song : mostLiked
          })

    // Pause current song if necessary (i.e. song was played outside juke jam)
    let externallyPlaying = response.data.is_playing
    if (externallyPlaying){
        await pauseExternal(authToken)
    }

    let sameSong = response.data.item && (response.data.item.uri == song.uri)
    let playOptions = {
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
            Authorization: 'Bearer ' + authToken,
            'Content-Type': 'application/json',
        },
        params: {
            device_id: room.device_id,
        },
        data: {
            uris: [song.uri],
        },
    }
    // Set shorter timer if we're resuming from middle of a song
    let songLength = song.length
    if (resume && sameSong) {
        playOptions.data.uris = null
        songLength = response.data.item.duration_ms - response.data.progress_ms
    }

    // Make Spotify request to play song
    axios(playOptions)
        .then(() => {
            // Update room data
            if (!resume) {
                room.updateOne({
                    $pull: { song_queue: { uri: song.uri } },
                }).exec()
            }
            song.paused = false
            room.currently_playing = song
            room.save()
            // Show playing song in client
            io.to(roomName).emit('songPlayed', {
                title: song.title,
                artist: song.artist,
                image: song.image,
                uri: song.uri,
            })
            // Change from API response to socket signal to keep sending updates
            // Set timer to play next song when current song ends
            console.log("TIMEOUT SET: ", songLength)
            clearTimeout(global_timer)
            global_timer = setTimeout(
                () => playSong(roomName, io, false),
                songLength
            )
            if (client) {
                client.json({
                    ok: true,
                    message: 'Song Played',
                })
            }
        })
        .catch((error) => {
            console.log(error.response.data)
            client.json({ ok: false, message: error })
        })
}

// Pause song currently playing on hosts account
// Should only be used before making request to play song from queue
// Pausing a song inside Juke Jam has separate handler (/pause)
async function pauseExternal(authToken){
    const playingOptions = {
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player',
        headers: {
            Authorization: 'Bearer ' + authToken,
        },
    }
    const pauseOptions = {
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/pause',
        headers: {
            Authorization: 'Bearer ' + authToken,
        },
    }
    try {
        await axios(pauseOptions)
    } catch (error) {
        console.log(error.response.data)
    }
}

// Helper function to format song object
async function formatSongArr(objectArr) {
    let songArr = []
    objectArr.forEach((item) => {
        let songItem = {
            id: item.id,
            uri: item.uri,
            title: item.name,
            description: item.artists[0].name,
            image: item.album.images[0].url,
            length: item.duration_ms,
        }
        songArr.push(songItem)
    })
    return songArr
}

module.exports = router
