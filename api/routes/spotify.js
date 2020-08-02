var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const request = require("request");

dotenv.config();

router.get("/authorize", function (req, res) {
	res.redirect(
		"https://accounts.spotify.com/authorize?response_type=code" +
			"&client_id=" +
			process.env.CLIENT_ID +
			"&redirect_uri=http://localhost:8000/spotify/get_token"
	);
});

// Retrieve authorization and refresh token from backend. Store in database under room name
router.post("/get_token", function (req, res) {
	console.log("hiit");
	let token = req.body.token;
	let roomName = req.body.roomName;
	const token_options = {
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

	request(token_options, function (err, response, body) {
		body = JSON.parse(body);
		console.log(body);
		let access_token = body.access_token;
		const user_options = {
		    url: "https://api.spotify.com/v1/me",
		    method: "GET",
		}
		request();
		if (body.error) {
			console.log(body.error_description);
			res.send("ERROR");
		} else {
			console.log("SUCCESS");
			console.log('SUCCESS');
			// let new_room = new Room({
			// 	name: room,
			// 	access_token: body.access_token,
			// 	refresh_token: body.refresh_token,
			// 	expires_in: body.expires_in,
			// 	generated_time: Date.now(),
			// });
			// new_room.save((err, room) => {
			// 	if (err) {
			// 		console.log(err);
			// 		res.send("ERROR");
			// 	} else {
			// 		console.log(room);
			// 		res.send("SUCCESS");
			// 	}
			// });
		}
	});
});

function refresh_token(refresh_key) {}

module.exports = router;
