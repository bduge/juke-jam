import React, { useState, useEffect, useRef } from 'react'
import './styles.css'
import { Grid, Image, Icon, Button} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { useDispatch } from 'react-redux'
import { resetLike } from '../actions/actions'

const mapStateToProps = (state) => {
    return ({
        roomName: state.roomName,
    })
}

const handleOnClick = (like, songTitle, roomName, changeByTwo) => {
    let likeOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            songTitle: songTitle,
            roomName: roomName,
            isLike: like,
            changeByTwo: changeByTwo
        }),
    }
    fetch('http://localhost:8000/change_like', likeOptions)
        .then((data) => data.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.log(error))
}



const Song = (props) => {
    const [isLike, setLike] = useState(null);
    const songDispatch = useDispatch();
    window.onbeforeunload = (e) => {
        if(isLike){
            songDispatch(resetLike(props.name, false))
            handleOnClick(false, props.name, props.roomName, false)
        } else if(isLike === false){
            songDispatch(resetLike(props.name, true))
            handleOnClick(true, props.name, props.roomName, false)
        }
    }
    return (
        <Grid>
            <Grid.Column width={4}>
                <Image src={props.image} size="tiny" />
            </Grid.Column>
            <Grid.Column width={12}>
                <strong>{props.name}</strong>
                <p>{props.artist}</p>
                <div>
                    <Button 
                    onClick={() => {
                        setLike(true)
                        if(isLike === null || isLike === false){
                            if(isLike === false ){
                                handleOnClick(true, props.name, props.roomName, true)
                            } else {
                                handleOnClick(true, props.name, props.roomName, false)
                            }
                        } else if(isLike === true){
                            setLike(null)
                            handleOnClick(false, props.name, props.roomName, false)
                        }
                    }} 
                    icon
                    labelPosition='right'
                    color={isLike ? "green" : "grey"}
                    >
                        <Icon colour={"green"} name="thumbs up outline" size="large" />
                        {props.likes > 0 ? props.likes : 0}
                    </Button>
                    <Button 
                    onClick={() => {
                        setLike(false)
                        if(isLike === null || isLike === true){
                            if(isLike == true){
                                handleOnClick(false, props.name, props.roomName, true)
                            } else {
                                handleOnClick(false, props.name, props.roomName, false)
                            }
                        } else if(isLike == false){
                            setLike(null)
                            handleOnClick(true, props.name, props.roomName, false)
                        }
                    }}
                    labelPosition='right'
                    icon
                    color={isLike === false ? "red" : "grey"}
                    >
                        <Icon colour={"red"} name="thumbs down outline" size="large" />
                        {props.likes < 0 ? props.likes : 0}
                    </Button>
                </div>
            </Grid.Column>
        </Grid>
    )
}

export default connect(mapStateToProps)(Song)