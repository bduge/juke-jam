var mongoose = require("mongoose");

let roomSchema = new mongoose.Schema({
	name: { type: String, required: true },
	access_token: String,
	refresh_token: String,
	generated_time: Date,
});

module.exports = mongoose.model("Room", roomSchema);
