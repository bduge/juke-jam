import React from 'react';
import { Container, Header, Input, Button, Grid} from 'semantic-ui-react';
import './styles.css';
import {Link} from 'react-router-dom';

const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientID = "91c3ae2425f9402eac9557c25c0080c0";
const redirectURI = "http://localhost:3000/create-room";


// const hash = window.location.hash.substring(1).split("&").reduce(
//     (initial, item) => {
//         if(item){
//             let parts = item.split("=");
//             initial[parts[0]] = decodeURIComponent(parts[1]);
//         }
//         return initial; 
//     }, {}
// );

// const hash = window.location.hash
//   .substring(1)
//   .split("&")
//   .reduce(function(initial, item) {
//     if (item) {
//       var parts = item.split("=");
//       initial[parts[0]] = decodeURIComponent(parts[1]);
//     }
//     return initial;
//   }, {});

// window.location.hash = "";

export default class createRoom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roomName: '',
            token: null,
        };
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        if(params.has('code')){
            this.setState({
                token: params.get('code')
            }); 
        }
    }

    onSetName = (e, {value}) => {
        this.setState({
            roomName: value, 
        });
    }

    render(){
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
                <Button 
                className={this.state.roomName == "" ? "disabled" : ""} 
                basic 
                size={"huge"} 
                color={"blue"}>
                    <a
                    href={ authEndpoint + '?response_type=code' + '&client_id=' + clientID + '&redirect_uri=' + redirectURI}
                    >Create</a>
                </Button>
                
                </Grid.Row>
            </Container>
        )
    }
}