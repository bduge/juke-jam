import React from "react";
import "./styles.css";
import { Header, Container, Button } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import {socket} from './socketConnection';

class NewRoom extends React.Component {
    constructor(props) {
        super(props);
        const roomId = this.props.match.params.roomId;
        const getIsHost = this.props.location.state ? this.props.isHost : false;
        this.callbackFunc = this.callbackFunc.bind(this);
        this.state = {
            roomName: roomId,
            isHost: getIsHost, 
            roomExist: null, 
        }
    }

    callbackFunc = (roomExist) => {
        roomExist ? this.setState({roomExist: true}) : this.setState({roomExist: false});
    }

    componentDidMount() {
        socket.emit("request join", this.state.roomName, this.callbackFunc);
    }

    createRoom = () => {
        this.state.socket.emit("create room", this.state.roomName);
    }

    render() {
        if(this.state.roomExist) {
            return(
                <Container className="containerStyle">
                    <Header
                    className="headerText"
                    textAlign={"center"}
                    as="h1"
                    content={"Welcome to " + this.state.roomName}
                    />
                </Container>
            )
        } else {
            return(
                <h1>Error page will go here</h1>
            )
        }
    }
}

export default withRouter(NewRoom)