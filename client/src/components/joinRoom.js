import React from 'react'

import { Container, Header, Input, Button, Grid, Modal, Icon, Segment, Label} from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import './styles.css'
import { setRoomName, setIsHost } from '../actions/actions'
import { connect } from 'react-redux'
import {Link as LinkScroll, animateScroll as scroll} from 'react-scroll';

const authEndpoint = 'https://accounts.spotify.com/authorize'
const clientID = '91c3ae2425f9402eac9557c25c0080c0'
const redirectURI = `${process.env.REACT_APP_BASE_URL}/join-room`
const scopes =
    'user-read-private user-read-email user-read-playback-state user-modify-playback-state'

const mapDispatchToProps = (dispatch) => {
    return({
        setRoomName: (roomName) => {dispatch(setRoomName(roomName))},
        setIsHost: (isHost) => {dispatch(setIsHost(isHost))}
        // updateQueue: 
    })
}

const mapStateToProps = (state) => {
    return({
        roomName: state.roomName
    })
}


class JoinRoom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roomName: '',
            authUserModal: false,
            errorMessage: '',
        }
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search)
        if (params.has('code')) {
            let code = params.get('code')
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    roomName: this.state.roomName,
                }),
            }
            fetch(`${process.env.REACT_APP_API_URL}/spotify/user_id`, requestOptions)
                .then(data => data.json())
                .then((data) => {
                    if (!data.ok){
                        if (data.message == "invalid"){
                            this.setState({ errorMessage: "Room doesn't exist" })
                        } else if (data.message == "denied"){
                            this.setState({
                                errorMessage: "Account could not be authorized"
                            })
                        } else if (data.message == "expired"){
                            this.setState({
                                errorMessage: "Spotify authorization has expired"
                            })
                        }
                        return
                    }
                    this.props.setRoomName(this.state.roomName)
                    this.props.setIsHost(true)
                    this.props.history.push({
                        pathname: '/room/' + this.state.roomName,
                        state: { isHost: true },
                    })
                })
        }
    }

    onSetName = (e, { value }) => {
        this.setState({
            roomName: value,
        })
        this.props.setRoomName(value);
    }

    joinRoomFunc = () => {
        this.props.setIsHost(false)
        this.props.history.push({
            pathname: '/room/' + this.state.roomName,
            state: { isHost: false },
        })
    }

    render() {
        return (
            <Container className="containerStyle">
                <div id="nav" className="navbar">
                    <Link to="/">
                        <Button>Back</Button>
                    </Link>
                </div>
                <Header
                    className="headerText"
                    textAlign={'center'}
                    as="h1"
                    content="Join a Room"
                />
                <Grid.Column className="centerItem">
                    {this.state.errorMessage ? 
                        (<Label basic color='red' size='large' pointing='right'>{this.state.errorMessage}</Label>) : <></>
                    }
                    <Input
                        onChange={this.onSetName}
                        className="inputStyle"
                        size={'huge'}
                        placeholder="Room Name"
                    />
      
                        <Button 
                        style={{
                            pointerEvents: this.state.roomName === "" ? 'none' : 'auto',
                            opacity : this.state.roomName === "" ? '0.4' : '1'
                        }}
                        onClick={this.joinRoomFunc}
                        basic 
                        size={"huge"} 
                        color={"blue"}
                        >
                            Join 
                        </Button>
                        <Modal
                        onClose={() => {this.setState({authUserModal: false})}}
                        onOpen={() => {this.setState({authUserModal: true})}}
                        open={this.state.authUserModal}
                        trigger={
                        <Button
                        style={{
                            opacity : this.state.roomName === "" ? '0.4' : '1',
                            pointerEvents: this.state.roomName === "" ? 'none' : 'auto'
                        }}
                        // onClick={this.props.setRoomName(this.state.roomName)}
                        basic 
                        size={"huge"} 
                        color={"green"} 
                        >
                            Join as Host
                        </Button>}
                        >
                            <Modal.Content>
                                <Container className="containerStyle">
                                    <Header
                                        className="headerText"
                                        textAlign={'center'}
                                        as="h1"
                                        content="Authorize Spotify to Proceed"
                                    />
                                    <Icon name='spotify' size='massive' />
                                    <div className='authorize'>
                                        <Button basic color='blue' size='huge'>
                                            <a
                                                href={
                                                    authEndpoint +
                                                    '?response_type=code' +
                                                    '&client_id=' +
                                                    clientID +
                                                    '&scope=' +
                                                    encodeURIComponent(scopes) +
                                                    '&redirect_uri=' +
                                                    encodeURIComponent(redirectURI)
                                                }
                                            >
                                                Login to Spotify
                                            </a>
                                        </Button>
                                    </div>
                                </Container>
                            </Modal.Content>
                        </Modal>
                </Grid.Column>
                <Grid.Row columns={1} className="center">
                <LinkScroll to='helpSection' spy={true} smooth={true} duration={1000}>
                    <div style={{position:"absolute", bottom:60, left:"50%"}}>
                        <Icon style={{position:"relative", left:"-50%"}} className="const-hvr-pulse" name="question circle outline" color="blue" size="huge"/>
                    </div> 
                </LinkScroll>
            
            </Grid.Row>
            <Grid.Row className='helpSection'>
            <div id='helpSection'>
            <Segment id='helpSection' placeholder inverted color='blue' textAlign='center'>
                <Header size='huge' as='h2'>
                    Help Guide
                </Header>
                <Header.Subheader>
                    If the host accidentally left the room, they can join the same room as the host again here
                </Header.Subheader>
            </Segment>
            </div>

            </Grid.Row>
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(JoinRoom))