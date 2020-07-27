var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const request = require("request");
const Room = require("../models/room");

dotenv.config();

// TEST ENDPOINT, call will be made from frontend
router.get("/authorize", function (req, res) {
	res.redirect(
		"https://accounts.spotify.com/authorize?response_type=code" +
			"&client_id=" +
			process.env.CLIENT_ID +
			"&redirect_uri=http://localhost:8000/spotify/get_token"
	);
});

// Retrieve authorization and refresh token from backend. Store in database under room name
router.get("/get_token", function (req, res) {
	let code = req.query.code;
	let room = req.query.room;

	const options = {
		url: "https://accounts.spotify.com/api/token",
		method: "POST",
		form: {
			grant_type: "authorization_code",
			code: code,
			redirect_uri: "http://localhost:8000/spotify/get_token",
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
		},
	};

	request(options, function (err, response, body) {
		body = JSON.parse(body);
		console.log(body);
		if (body.error) {
			console.log(body.error_description);
			res.send("ERROR");
		} else {
			let newRoom = new Room({
				name: room,
				access_token: body.access_token,
				refresh_token: body.refresh_token,
				generated_time: Date.now(),
			});
			newRoom.save((err, room) => {
				if (err) {
					console.log(err);
					res.send("ERROR");
				} else {
					console.log(room);
					res.send("SUCCESS");
				}
			});
		}
	});
});

function refresh_token(refresh_key) {}

module.exports = router;
