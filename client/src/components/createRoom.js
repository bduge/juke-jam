import React from 'react';
import { Container, Header, Input, Button, Grid} from 'semantic-ui-react';
import './styles.css';
import {Link} from 'react-router-dom';

const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientID = "91c3ae2425f9402eac9557c25c0080c0";
const redirectURI = "http://localhost:3000/create-room";
const scopes = 'user-read-private user-read-email';

export default class createRoom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roomName: '',
            isAuthenticated: false, 
            token: null, 
        };
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        if(params.has('code')){
            this.setState({
                token: params.get('code'),
                isAuthenticated: true, 
            }); 
        }
    }

    onSetName = (e, {value}) => {
        this.setState({
            roomName: value, 
        });
    }

    sendToken = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token: this.state.token, roomName: this.state.roomName}),
        };
        fetch('http://localhost:8000/spotify/get_token', requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log("Success");
        }).catch((error) => {
            console.log("ERROR:", error);
        })
    }

    render(){
        if(this.state.isAuthenticated){
            return(
                <Container className="containerStyle">
                    <Header
                        className="headerText"
                        textAlign={"center"}
                        as="h1"
                        content="Create a Room!"
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
                            roomName: this.state.roomName,
                        }
                    }}>
                    <Button 
                    onClick={this.sendToken}
                    className={this.state.roomName == "" ? "disabled" : ""} 
                    basic 
                    size={"huge"} 
                    color={"blue"}>
                        Create  
                    </Button>
                    </Link>
                    </Grid.Row>
                </Container>
            )
        } else {
            return (
                <Container className="containerStyle">
                    <Header
                        className="headerText"
                        textAlign={"center"}
                        as="h1"
                        content="Login to Spotify"
                    />
                    <Grid.Row className="centerItem">
                        <Button>
                            <a href={ authEndpoint + '?response_type=code' + '&client_id=' + clientID + 
                            '&scope=' + encodeURIComponent(scopes) + '&redirect_uri=' + encodeURIComponent(redirectURI)}>
                                 Login to Spotify
                            </a>
                        </Button>
                    </Grid.Row>
                </Container>
            )
        }
        
    }
}