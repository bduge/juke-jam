import React from 'react'
import './styles.css'
import { Grid, Image, Icon, Button} from 'semantic-ui-react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return ({
        roomName: state.roomName
    })
}

const handleOnClick = (like, songTitle, roomName) => {
    let likeOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            songTitle: songTitle,
            roomName: roomName,
            isLike: like
        }),
    }
    fetch('http://localhost:8000/change_like', likeOptions)
        .then((data) => data.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.log(error))
}

const Song = (props) => {
    return (
        <Grid>
            <Grid.Column width={4}>
                <Image src={props.image} size="tiny" />
            </Grid.Column>
            <Grid.Column width={12}>
                <strong>{props.name}</strong>
                <p>{props.artist}</p>
                <div>
                    <Button onClick={() => {handleOnClick(true, props.name, props.roomName)}} icon>
                        <Icon name="angle up" size="large" />
                    </Button>
                    <Button onClick={() => {handleOnClick(false, props.name, props.roomName)}}icon>
                        <Icon name="angle down" size="large" />
                    </Button>
                </div>
            </Grid.Column>
        </Grid>
    )
}

export default connect(mapStateToProps)(Song)