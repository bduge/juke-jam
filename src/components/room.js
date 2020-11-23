import React from 'react'
import './styles.css'
import { Header, Container, Button, Loader, Grid } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import { socket } from './socketConnection'
import DeviceModal from './deviceModal'
import SearchBar from './searchBar'
import Queue from './queue'
import Player from './player'
import { exitAction, addSongArr } from '../actions/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => {
    return ({
        exitAction: () => {dispatch(exitAction())},
        addSongArr: (songArr) => {dispatch(addSongArr(songArr))}
    })
}

const mapStateToProps = (state) => {
    return ({
        queue: state.queue,
        roomName: state.roomName
    })
}

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
        }
    }

    getCurrentRoomSongs = (roomName, storeSongs) => {
        console.log("GETTING SONGS")
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomName: roomName,
                storeSongs: storeSongs
            }),
        }
        fetch(`${process.env.REACT_APP_BASE_URL}/spotify/get_room_songs`, requestOptions)
            .then((data) => data.json())
            .then((data) => {
                console.log("Returned Song Array")
                console.log(data.songArray)
                this.props.addSongArr(data.songArray)
            })
            .catch((error) => {
                console.log('ERROR:', error)
            })
    }


    componentDidMount() {
        socket.emit('request join', this.state.roomName, this.checkRoomCallback)
        console.log(this.props.queue.queue.length)
        console.log(this.props.queue.queue)
        this.getCurrentRoomSongs(this.props.roomName, this.props.queue.queue)
        window.addEventListener("beforeunload", this.deleteLocalStorage)
        // Check if redux store is missing any songs 
    }

    componentWillUnmount() {
        socket.emit('request leave', this.state.roomName, null)
        window.removeEventListener("beforeunload", this.deleteLocalStorage)
    }

    deleteLocalStorage = () => {
        console.log("Clear Local Storage")
        this.props.exitAction()
    }

    checkRoomCallback = (roomExist, msg) => {
        console.log(msg)
        roomExist
            ? this.setState({ roomExist: true, checkingRoom: false })
            : this.setState({ roomExist: false, checkingRoom: false })
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
        fetch(`${process.env.REACT_APP_BASE_URL}/spotify/update_device`, requestOptions)
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
                            <Button onClick={this.deleteLocalStorage}>Leave</Button>
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
                            <div id="queue">
                                <Queue/>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header
                                textAlign={'left'}
                                as="h2"
                                content="Search"
                            />
                            <div id="searchWrapper">
                                <SearchBar roomName={this.state.roomName} />
                            </div>

                        </Grid.Column>
                        <Grid.Column width={4}>
                        <Header
                                textAlign={'left'}
                                as="h2"
                                content="Playing"
                            />
                            <Player
                                room={this.state.roomName}
                                isHost={this.state.isHost}
                            ></Player>
                        </Grid.Column>
                    </Grid>
                </Container>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Room))