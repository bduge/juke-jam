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

router.get("/get_token", function (req, res) {
	let code = req.query.code;
	let error = req.query.error;
	// let state = req.params.state;
	if (error) {
		console.log("ERROR: " + error);
		res.send("ERROR");
	}

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

	request(options, function (err, res, body) {
		body = JSON.parse(body);
		console.log(body);
	});
	res.send("hello");
});

function refresh_token(refresh_key) {}

module.exports = router;
