import React from 'react'
import { Container, Header, Input, Button, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './styles.css'
import { setRoomName, setIsHost } from '../actions/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
    return({
        setRoomName: (roomName) => {dispatch(setRoomName(roomName))},
        setIsHost: (isHost) => {dispatch(setIsHost(isHost))}
        // updateQueue: 
    })
}

class JoinRoom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roomName: '',
        }
    }

    onSetName = (e, { value }) => {
        this.setState({
            roomName: value,
        })
    }

    joinRoom = () => {
        this.props.setRoomName(this.state.roomName)
        this.props.setIsHost(false)
        this.props.history.push({
            pathname: '/room/' + this.state.roomName,
            state: { isHost: false },
        })
    }

    render() {
        return (
            <Container className="containerStyle">
                <Header
                    className="headerText"
                    textAlign={'center'}
                    as="h1"
                    content="Join a Room!"
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
                    <Link to ={{
                        pathname:'/room/' + this.state.roomName,
                        state:{
                            isHost : false, 
                            roomName: this.state.roomName,
                        }
                    }}>
                    <Button 
                    className={this.state.roomName === "" ? "disabled" : ""}
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

export default connect(null, mapDispatchToProps)(JoinRoom)