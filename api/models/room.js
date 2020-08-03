var mongoose = require("mongoose");

let roomSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	room_owner_email: { type: String, require: true },
	access_token: String,
	refresh_token: String,
	token_expiry: Date,
});

module.exports = mongoose.model("Room", roomSchema);
