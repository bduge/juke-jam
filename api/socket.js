var socketio = require("socket.io");

function connectSocket(server) {
	io = socketio(server);
	io.on("connection", (socket) => {
		console.log("A user connected");
		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});
}

module.exports = connectSocket;
