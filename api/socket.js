var socketio = require("socket.io");
const Room = require("./models/room");

function connectSocket(server) {
	io = socketio(server);
	io.on("connection", (socket) => {
		console.log("A user connected: " + socket.id);

		// Disconnect
		socket.on("disconnect", () => {
			console.log("User disconnected");
		});

		// Create Room
		socket.on("request create", async (roomName, callback) => {
			let existing = await Room.findOne({ name: roomName }).exec();
			if (existing) {
				callback(false, "Room already exists");
			} else {
				socket.join(roomName);
				callback(true, "Room created");
			}
		});

		// Join Room
		socket.on("request join", async (roomName, callback) => {
			if (roomName == "") {
				callback(false, "Invalid room name");
			} else if (Object.keys(socket.rooms).length > 1) {
				callback(false, "Already in room");
			} else {
				let existing = await Room.findOne({ name: roomName }).exec();
				if (!existing) {
					callback(false, "Room doesn't exist");
				} else {
					socket.join(roomName);
					cb(true, "Joined " + roomName);
				}
			}
		});

		// Leave Room
		socket.on("request leave", (roomName, callback) => {
			console.log(roomName);
			socket.leave(roomName);
			callback(true, "Left " + roomName);
		});

		// Chat feature (testing purposes)
		socket.on("chat message", (msg, room) => {
			console.log(socket.rooms);
			io.to(room).emit("chat message", msg);
		});
	});
}

module.exports = connectSocket;
