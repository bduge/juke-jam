import React from 'react'
import './styles.css'
import {
    Header,
    Container,
    Button,
    Loader,
    Grid,
} from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import { socket } from './socketConnection'
import Song from './song'
import DeviceModal from './deviceModal'
import SearchBar from './searchBar'

class Room extends React.Component {
    constructor(props) {
        super(props)
        const roomId = this.props.match.params.roomId
        const getIsHost = this.props.location.state
            ? this.props.location.state.isHost
            : false
        this.checkRoomCallback = this.checkRoomCallback.bind(this)
        this.saveDevice = this.saveDevice.bind(this)
        this.state = {
            roomName: roomId,
            isHost: getIsHost,
            roomExist: null,
            checkingRoom: true,
            queue: {
                // Sample data
                0: {
                    songTitle: 'Rainbow Bap',
                    artist: 'Jaden Smith',
                    likes: 4,
                    image:
                        'https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_90,w_1400/fl_lossy,pg_1/enb4vwjaj54jtat121st/jaden-smith-ctv3-cool-tape-vol-3-stream',
                },
                1: {
                    songTitle: 'Wishing Well',
                    artist: 'Juice Wrld',
                    likes: 2,
                    image:
                        'https://upload.wikimedia.org/wikipedia/en/f/f6/Juice_Wrld_-_Legends_Never_Die.png',
                },
            },
        }
    }

    componentDidMount() {
        socket.emit('request join', this.state.roomName, this.checkRoomCallback)
    }

    componentWillUnmount() {
        socket.emit('request leave', this.state.roomName, null)
    }

    checkRoomCallback = (roomExist, msg) => {
        console.log(msg)
        roomExist
            ? this.setState({ roomExist: true, checkingRoom: false })
            : this.setState({ roomExist: false, checkingRoom: false })
    }

    makeQueue() {
        return Object.keys(this.state.queue).map((key, _) => {
            const song = this.state.queue[key]
            return (
                <Song
                    key={song.songTitle + song.artist}
                    name={song.songTitle}
                    artist={song.artist}
                    likes={song.likes}
                    image={song.image}
                    inQueue={true}
                />
            )
        })
    }

    saveDevice = (deviceId) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room: this.state.roomName,
                device: deviceId,
            }),
        }
        fetch('http://localhost:8000/spotify/update_device', requestOptions)
            .then((data) => data.json())
            .then((data) => {
                if (data.ok !== true) {
                    console.log(data.message)
                }
            })
            .catch((error) => {
                console.log('ERROR:', error)
            })
    }

    render() {
        if (this.state.checkingRoom) {
            return <Loader content="Loading" active />
        } else if (!this.state.roomExist) {
            return <h1>Error page will go here</h1> // TODO
        } else {
            return (
                <Container className="containerStyle">
                    <div id="nav" className="navbar">
                        <Link to="/">
                            <Button>Leave</Button>
                        </Link>
                        {/* {this.state.isHost ? ( */}
                        <DeviceModal
                            roomName={this.state.roomName}
                            saveDevice={this.saveDevice}
                        />
                        {/* ) : ( */}
                        {/* <></> */}
                        {/* )} */}
                    </div>
                    <Header
                        className="headerText"
                        textAlign={'center'}
                        as="h3"
                        content={this.state.roomName.toUpperCase()}
                    />
                    <Grid>
                        <Grid.Column width={6}>
                            <Header
                                textAlign={'left'}
                                as="h2"
                                content="Queue"
                            />
                            <div id="queue">{this.makeQueue()}</div>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Header
                                textAlign={'left'}
                                as="h2"
                                content="Search"
                            />
                            <div id="searchWrapper">
                            <SearchBar roomName={this.state.roomName}/>
                            </div>

                            <div>{/* TODO: IMPLEMENT SEARCH RESULTS */}</div>
                        </Grid.Column>
                    </Grid>
                </Container>
            )
        }
    }
}

export default withRouter(Room)
