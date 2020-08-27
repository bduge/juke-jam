import React from "react";
import "./styles.css";
import { Header, Container, Button } from "semantic-ui-react";

export default class NewRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomName: this.props.location.state.roomName,
            isHost: this.props.location.state.isHost, 
        }
    }
    createRoom = () => {
        this.state.socket.emit("create room", this.state.roomName);
    }

    componentDidMount() {
        if(this.state.isHost){
            this.createRoom();
        }
    }

    render() {
        return(
            <Container className="containerStyle">
                <Header
                className="headerText"
                textAlign={"center"}
                as="h1"
                content={"Welcome to " + this.props.location.state.roomName}
                />
            </Container>
        )
    }
}
