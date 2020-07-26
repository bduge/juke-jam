import React from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
const endpoint = "http://localhost:8000";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { room: "", socket: socketIOClient(endpoint) };

		this.joinRoom = this.joinRoom.bind(this);
		this.updateRoom = this.updateRoom.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.leaveRoom = this.leaveRoom.bind(this);

		this.state.socket.on("chat message", function (msg) {
			let list = document.getElementById("messages");
			let newMsg = document.createElement("li");
			let msgContent = document.createTextNode(msg);
			newMsg.appendChild(msgContent);
			list.appendChild(newMsg);
		});
	}
	joinRoom() {
		var roomName = document.querySelector("input").value;
		this.state.socket.emit("request join", roomName, this.updateRoom);
	}
	updateRoom(roomName) {
		this.setState({
			room: roomName,
		});
	}
	sendMessage() {
		this.state.socket.emit(
			"chat message",
			document.getElementById("m").value,
			this.state.room
		);
		document.getElementById("m").value = "";
	}
	leaveRoom() {
		if (this.state.room == "") {
			return;
		}
		this.state.socket.emit("request leave", this.state.room, this.updateRoom);
	}

	render() {
		return (
			<div className="App">
				<h1>{this.state.room}</h1>
				<input id="m" type="text" />
				<button onClick={this.joinRoom}>Join</button>
				<button onClick={this.sendMessage}>Send</button>
				<button onClick={this.leaveRoom}>Leave</button>
				<br />
				<ul id="messages"></ul>
			</div>
		);
	}
}

export default App;
