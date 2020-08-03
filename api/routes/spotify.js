var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const Room = require("../models/room");

dotenv.config();

const scopes = "user-read-private user-read-email";

// TEST ENDPOINT, call will be made from frontend
router.get("/authorize", function (req, res) {
	res.redirect(
		"https://accounts.spotify.com/authorize?response_type=code" +
			"&client_id=" +
			process.env.CLIENT_ID +
			"&scope=" +
			encodeURIComponent(scopes) +
			"&redirect_uri=http://localhost:8000/spotify/get_token"
	);
});

// Retrieve authorization and refresh token from backend. Store in database under room name
router.post("/get_token", async function (req, res) {
	let code = req.body.token;
	let room = req.body.roomName || "Bill's room";

	const token_options = {
		method: "post",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		url: "https://accounts.spotify.com/api/token",
		params: {
			grant_type: "authorization_code",
			code: code,
			redirect_uri: "http://localhost:3000/create-room",
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
		},
	};
	let body;
	try {
		let response = await axios(token_options);
		body = response.data;
	} catch (error) {
		console.log(error);
		res.send(ERROR);
		return;
	}

	let access_token = body.access_token;
	let email;
	try {
		email = await get_user(access_token);
	} catch (error) {
		console.log(error);
		res.send("ERROR");
		return;
	}

	let new_room = new Room({
		name: room,
		room_owner_email: email,
		access_token: access_token,
		refresh_token: body.refresh_token,
		token_expiry: +new Date(Date.now() + body.expires_in * 975),
	});
	new_room.save((err, room) => {
		if (err) {
			console.log(err);
			res.send("ERROR");
		} else {
			res.send("SUCCESS");
		}
	});
});

// Get users email from spotify api
async function get_user(access_token) {
	const user_options = {
		url: "https://api.spotify.com/v1/me",
		headers: {
			Authorization: "Bearer " + access_token,
		},
	};
	let response;
	try {
		response = await axios(user_options);
	} catch (error) {
		console.log(error);
		return false;
	}
	let body = response.data;
	return body.email;
}

router.get("/time", function (req, res) {
	let room_name = req.query.name || "ryans room";
	refresh_token(room_name);
	res.send("Hello");
});

async function refresh_token(room_name) {
	let room = await Room.findOne({ name: room_name }).exec();
	let expiry_time = new Date(room.token_expiry);
	console.log("TIME " + expiry_time);
	if (Date.now() > expiry_time) {
		console.log("Need update");
	} else {
		return;
	}
}

module.exports = router;
