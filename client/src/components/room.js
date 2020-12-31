import React from 'react'
import './styles.css'
import { Header, Container, Button, Loader, Grid, Popup, Modal, Icon, Label } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import { socket } from './socketConnection'
import DeviceModal from './deviceModal'
import SearchBar from './searchBar'
import Queue from './queue'
import Player from './player'
import { exitAction, addSongArr, setRoomName } from '../actions/actions'
import { connect } from 'react-redux'
import copy from "copy-to-clipboard"

const mapDispatchToProps = dispatch => {
    return ({
        exitAction: () => {dispatch(exitAction())},
        addSongArr: (songArr) => {dispatch(addSongArr(songArr))},
        setRoomName: (roomName) => {dispatch(setRoomName(roomName))},
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
        const Link = window.location.href; 
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
            shareableLink: Link, 
            isDeviceConnected: false, 
            trigPopNoDevice: false, 
        }
        this.noDeviceHandler = this.noDeviceHandler.bind(this);
        this.saveDevice = this.saveDevice.bind(this);
        this.props.setRoomName(this.state.roomName);
    }


    noDeviceHandler = (doTrig) => this.setState({trigPopNoDevice: doTrig})

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
        fetch(`${process.env.REACT_APP_API_URL}/spotify/get_room_songs`, requestOptions)
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
        this.getCurrentRoomSongs(this.state.roomName, this.props.queue.queue)
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

    saveLink = () => {
        copy(this.state.shareableLink)
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
        fetch(`${process.env.REACT_APP_API_URL}/spotify/update_device`, requestOptions)
            .then((data) => data.json())
            .then((data) => {
                if (data.ok !== true) {
                    console.log(data.message)
                } else {
                    this.setState({isDeviceConnected: true});
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
            return (
                <Container className="errorPage">
                    <h1> Uh oh, it seems that this room doesn't exist. </h1>
                    <p> Return to the home page to create a room or join another one.</p>
                    <Link to="/">
                        <Button>Home</Button>
                    </Link>
                </Container>
            )
        } else {
            return (
                <Container className="containerStyle">
                    <Modal
                    open={this.state.trigPopNoDevice}
                    size='mini'
                    centered={true}
                    >
                        <Modal.Header style={{textAlign:'center'}}>
                            <Icon color='blue' size='large' name="question circle outline"/>
                        </Modal.Header>
                        <Modal.Content>
                            <h2 style={{textAlign:'center'}}>A Device Must First Be Connected</h2>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button
                            content="Got it!"
                            labelPosition='right'
                            icon='checkmark'
                            onClick={() => this.setState({trigPopNoDevice: false})}
                            positive
                            />
                        </Modal.Actions>
                    </Modal>
                    <textarea style={{display:"none"}}
                    ref={(textarea) => this.textArea = textarea}
                    value={this.state.shareableLink}
                    />
                    <div id="nav" className="navbar">
                        <Link to="/">
                            <Button onClick={this.deleteLocalStorage}>Leave</Button>
                        </Link>
                        {this.state.isHost ? (
                        <DeviceModal
                            roomName={this.state.roomName}
                            saveDevice={this.saveDevice}
                        />
                        ) : (
                        <></>
                        )}
                    </div>
                    <div className='header'>
                        <Header
                            className="headerText"
                            textAlign={'center'}
                            as="h3"
                            content={this.state.roomName.toUpperCase()}
                        />
                        <Popup
                            content='Link Copied'
                            on='click'
                            pinned
                            trigger={
                                <Icon className='linkButton' name='linkify' onClick={this.saveLink}/>
                            }
                        />  
                    </div>
                    
                    
                    <Grid stackable>
                    <Grid.Column width={5}>
                        <Header
                                textAlign={'center'}
                                as="h2"
                                content="Playing"
                        />
                            <Player
                                room={this.state.roomName}
                                isHost={this.state.isHost}
                                deviceConnected={this.state.isDeviceConnected}
                                triggerPopup={this.noDeviceHandler}
                            ></Player>
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
                    <Grid.Column width={5}>
                            <Header
                                textAlign={'left'}
                                as="h2"
                                content="Queue"
                            />
                            <div id="queue">
                                <Queue/>
                            </div>
                    </Grid.Column>
                    </Grid>
                </Container>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Room))