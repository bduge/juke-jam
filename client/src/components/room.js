import React from "react";
import "./styles.css";
import { Header, Container, Button, Loader } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { socket } from "./socketConnection";

class Room extends React.Component {
	constructor(props) {
		super(props);
		const roomId = this.props.match.params.roomId;
		const getIsHost = this.props.location.state
			? this.props.location.state.isHost
			: false;
		this.callbackFunc = this.callbackFunc.bind(this);
		this.state = {
			roomName: roomId,
			isHost: getIsHost,
			roomExist: null,
			checkingRoom: true,
		};
	}

	callbackFunc = (roomExist) => {
		roomExist
			? this.setState({ roomExist: true, checkingRoom: false })
			: this.setState({ roomExist: false, checkingRoom: false });
	};

	componentDidMount() {
		socket.emit("request join", this.state.roomName, this.callbackFunc);
	}

	render() {
		if (this.state.checkingRoom) {
			return <Loader content="Loading" active />;
		} else if (this.state.roomExist) {
			return (
				<Container className="containerStyle">
					<Header
						className="headerText"
						textAlign={"center"}
						as="h1"
						content={"Welcome to " + this.state.roomName}
					/>
				</Container>
			);
		} else {
			return <h1>Error page will go here</h1>;
		}
	}
}

export default withRouter(Room);
