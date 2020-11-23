import React from 'react'
import { Container, Header, Input, Button, Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setRoomName, setIsHost } from '../actions/actions'
import './styles.css'

const authEndpoint = 'https://accounts.spotify.com/authorize'
const clientID = '91c3ae2425f9402eac9557c25c0080c0'
const redirectURI = `${process.env.REACT_APP_BASE_URL}/create-room`
const scopes =
    'user-read-private user-read-email user-read-playback-state user-modify-playback-state'

const mapDispatchToProps = (dispatch) => {
    return({
        setRoomName: (roomName) => {dispatch(setRoomName(roomName))},
        setIsHost: (isHost) => {dispatch(setIsHost(isHost))}
    })
}

class CreateRoom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roomName: '',
            isAuthenticated: false,
            token: null,
            // add new state property for if room name already exists
        }
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search)
        if (params.has('code')) {
            this.setState({
                token: params.get('code'),
                isAuthenticated: true,
            })
        }
    }

    onSetName = (e, { value }) => {
        this.setState({
            roomName: value,
        })
        this.props.setRoomName(value)
    }

    sendToken = () => {
        //Send Token to server
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: this.state.token,
                roomName: this.state.roomName,
            }),
        }
        //handle different name cases (when names have spaces, etc) might cause issues
        fetch(`${process.env.REACT_APP_BASE_URL}/spotify/get_token`, requestOptions)
            .then((data) => data.json())
            .then((data) => {
                // Handle errors (i.e. when data.ok == false)
                console.log(data)
                this.props.setIsHost(true);
                this.props.history.push({
                    pathname: '/room/' + this.state.roomName,
                    state: { isHost: true },
                })
            })
            .catch((error) => {
                console.log('ERROR:', error)
            })
        //Create new socket channel (room)
    }


    render() {
        if (this.state.isAuthenticated) {
            return (
                <Container className="containerStyle">
                    <Header
                        className="headerText"
                        textAlign={'center'}
                        as="h1"
                        content="Create a Room!"
                    />
                    <Grid.Row className="centerItem">
                        <Input
                            onChange={this.onSetName}
                            fluid
                            className="inputStyle"
                            size={'massive'}
                            transparent
                            placeholder="Click Here to Enter Room Name"
                        />
                        <Button
                            onClick={this.sendToken}
                            className={
                                this.state.roomName === '' ? 'disabled' : ''
                            }
                            basic
                            size={'huge'}
                            color={'blue'}
                        >
                            Create
                        </Button>
                    </Grid.Row>
                </Container>
            )
        } else {
            return (
                <Container className="containerStyle">
                    <Header
                        className="headerText"
                        textAlign={'center'}
                        as="h1"
                        content="Login to Spotify"
                    />
                    <Grid.Row className="centerItem">
                        <Button>
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
                    </Grid.Row>
                </Container>
            )
        }
    }
}

export default connect(null, mapDispatchToProps)(CreateRoom)