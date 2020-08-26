import React from "react";
import "./styles.css";
import { Header, Container, Button } from "semantic-ui-react";

export default class newRoom extends React.Component {
	render() {
		return (
			<Container className="containerStyle">
				<Header
					className="headerText"
					textAlign={"center"}
					as="h1"
					content={"Welcome to " + this.props.location.state.roomName}
				/>
			</Container>
		);
	}
}
