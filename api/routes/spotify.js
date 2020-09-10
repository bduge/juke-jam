var express = require('express')
var router = express.Router()
const axios = require('axios')
const Room = require('../models/room')

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

router.put('/update_device', async function (req, res) {
    let roomName = req.body.room
    let deviceId = req.body.device
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
            room.save()
            res.json({ ok: true, message: 'Transfer Request sent' })
        })
        .catch((error) => {
            console.log(error)
            res.json({ ok: false, message: error })
        })
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

function playSong(songObj) {
    let songId = songObj.id
    const songOptions = {
        method: 'put',
        headers: { 
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": "Bearer " + authToken, 
        },
        url: "https://api.spotify.com/v1/me/player/play",
        params: {
            context_uri: songObj.uri, 
            position_ms: 0,
        }
    }
}

// Helper function to format song object
async function formatSongArr(objectArr) {
	let songArr = [];
	console.log(objectArr);
	objectArr.forEach((item) => {
		let songItem = {
			id: item.id, 
			uri: item.uri, 
			title: item.name, 
			description: item.artists[0].name,
            image: item.album.images[0].url, 
            length: item.duration_ms
		}
		songArr.push(songItem);
	});
	console.log(songArr);
	return songArr; 
}

// Search for song using spotify api 
router.post("/search", async function(req, res) {
	let searchString = req.body.searchString; 
	let roomName = req.body.roomName; 
	console.log("im here");
	let currRoom = await Room.findOne({ name: roomName }).exec();
	console.log(currRoom);
	let authToken = currRoom.access_token; 
	refresh_token(roomName);
	console.log(authToken); 
	const search_options = {
		method: "get",
		headers: { 
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": "Bearer " + authToken, 
		},
		url: 'https://api.spotify.com/v1/search',
		params: {
			q: searchString, 
			type: "track",
			limit: 5, 
		},
	};

	try {
		let response = await axios(search_options);
        let results = await formatSongArr(response.data.tracks.items);
		res.send(results); 
	} catch (error) {
		console.log(error);
	}
});

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
