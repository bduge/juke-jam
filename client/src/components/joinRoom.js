import React from 'react';
import { Container, Header, Input, Button, Grid} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import './styles.css';
import {socket} from './socketConnection';

export default class JoinRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomName: "",
        }
        this.callbackFunc = this.callbackFunc.bind(this);
    }

    onSetName = (e, {value}) => {
        this.setState({
            roomName: value, 
        });
    }

    callbackFunc = (didPass) => {
        if(didPass) {
            <Redirect to ={{
                pathname:'/new-room',
                state:{
                    isHost : false, 
                    roomName: this.state.roomName,
                }
            }}/>
        } 
    }

    joinRoom = () => {
        socket.emit("request join", this.state.roomName, callbackFunc);
    }

    render() {
        return(
            <Container className="containerStyle">
                    <Header
                        className="headerText"
                        textAlign={"center"}
                        as="h1"
                        content="Join a Room!"
                    />
                    <Grid.Row className="centerItem">
                    <Input
                        onChange={this.onSetName}
                        fluid
                        className="inputStyle"
                        size={"massive"}
                        transparent
                        placeholder="Click Here to Enter Room Name"
                    />
                    <Link to ={{
                        pathname:'/new-room',
                        state:{
                            isHost : false, 
                            roomName: this.state.roomName,
                        }
                    }}>
                    <Button 
                    className={this.state.roomName == "" ? "disabled" : ""}
                    onClick={this.joinRoom}
                    basic 
                    size={"huge"} 
                    color={"blue"}>
                        Join 
                    </Button>
                    </Link>
                    </Grid.Row>
                </Container>
        )
    }
}