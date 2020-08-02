var mongoose = require("mongoose");

let roomSchema = new mongoose.Schema({
	name: { type: String, required: true },
	room_owner_email: { type: String, require: true },
	access_token: String,
	refresh_token: String,
	generated_time: Date,
	expires_in: Number,
});

module.exports = mongoose.model("Room", roomSchema);
