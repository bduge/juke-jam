import React from 'react'
import { Container, Header, Input, Button, Grid, Label, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setRoomName, setIsHost } from '../actions/actions'
import './styles.css'

const authEndpoint = 'https://accounts.spotify.com/authorize'
const clientID = `${process.env.REACT_APP_CLIENT_ID}`
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
            errorMessage: '',
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
        fetch(`${process.env.REACT_APP_API_URL}/spotify/get_token`, requestOptions)
            .then((data) => data.json())
            .then((data) => {
                // Handle errors (i.e. when data.ok == false)
                if (!data.ok){
                    if (data.message == "exists"){
                        this.setState({
                            errorMessage: "This room name already exists"
                        })
                    } else if (data.message == "creation"){
                        this.setState({
                            errorMessage: "This room could not be created"
                        })
                    } else if (data.message == "expired"){
                        this.setState({
                            errorMessage: "Spotify authorization has expired"
                        })
                    }
                    return
                }
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
                    <div id="nav" className="navbar">
                        <Link to="/">
                            <Button>Back</Button>
                        </Link>
                    </div>
                    <Header
                        className="headerText"
                        textAlign={'center'}
                        as="h1"
                        content="Create a Room"
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
                    </Grid.Column>
                </Container>
            )
        } else {
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
                        content="Authorize Spotify to Proceed"
                    />
                    <Icon name='spotify' size='massive'/>
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
            )
        }
    }
}

export default connect(null, mapDispatchToProps)(CreateRoom)