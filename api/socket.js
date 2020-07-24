var socketio = require("socket.io");

function connectSocket(server) {
	io = socketio(server);
	io.on("connection", (socket) => {
		console.log("A user connected");

		// Disconnect
		socket.on("disconnect", () => {
			console.log("User disconnected");
		});

		// Join Room
		socket.on("request join", (roomName, cb) => {
			console.log(socket.rooms);
			if (roomName == "") {
				return;
			}
			if (Object.keys(socket.rooms).length > 1) {
				return;
			}
			socket.join(roomName);
			cb(roomName);
		});

		// Leave Room
		socket.on("request leave", (roomName, cb) => {
			console.log(roomName);
			socket.leave(roomName);
			cb("");
		});

		// Chat feature (testing purposes)
		socket.on("chat message", (msg, room) => {
			console.log(socket.rooms);
			io.to(room).emit("chat message", msg);
		});
	});
}

module.exports = connectSocket;
