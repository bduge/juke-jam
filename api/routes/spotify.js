var express = require('express')
var router = express.Router()
const dotenv = require('dotenv')
const axios = require('axios')
const Room = require('../models/room')

dotenv.config()

// Retrieve authorization and refresh token from backend. Store in database under room name
router.post('/get_token', async function (req, res) {
    let code = req.body.token
    let room = req.body.roomName || 'test' // Default value for testing purposes

    // Set api call options for call to spotify
    const token_options = {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: 'https://accounts.spotify.com/api/token',
        params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3000/create-room',
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
        console.log(error)
        res.json({ ok: false, message: error })
        return
    }

    // Get email of user
    let access_token = body.access_token
    let email
    try {
        email = await get_user_email(access_token)
    } catch (error) {
        console.log(error)
        res.json({ ok: false, message: error })
        return
    }

    // Create new room
    let new_room = new Room({
        name: room,
        room_owner_email: email,
        access_token: access_token,
        refresh_token: body.refresh_token,
        token_expiry: +new Date(Date.now() + body.expires_in * 980),
    })
    new_room.save((error, room) => {
        if (error) {
            console.log(error)
            res.json({ ok: false, message: error })
        } else {
            res.json({ ok: true, message: 'SUCCESS' })
        }
    })
})

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
        console.log(error)
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

// Get users email from spotify api
async function get_user_email(access_token) {
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
        console.log(error)
        return false
    }
    let body = response.data
    return body.email
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
            res.send('ERROR')
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

// ROUTES FOR TESTING PURPOSES
const scopes = 'user-read-private user-read-email'
router.get('/refresh_token_test', function (req, res) {
    let room_name = req.query.name || 'test'
    refresh_token(room_name)
    res.send('Hello')
})

router.get('/authorize_test', function (req, res) {
    res.redirect(
        'https://accounts.spotify.com/authorize?response_type=code' +
            '&client_id=' +
            process.env.CLIENT_ID +
            '&scope=' +
            encodeURIComponent(scopes) +
            '&redirect_uri=http://localhost:8000/spotify/get_token'
    )
})

module.exports = router
