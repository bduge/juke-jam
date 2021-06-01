import React, { useState, useEffect, useRef } from 'react'
import './styles.css'
import { Grid, Image, Icon, Button, Label} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { useDispatch } from 'react-redux'
import { userLike } from '../actions/actions'

const mapStateToProps = (state) => {
    return ({
        roomName: state.roomName
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
    fetch(`${process.env.REACT_APP_API_URL}/change_like`, likeOptions)
        .catch((error) => console.log(error))
}



const Song = (props) => {
    const [isLike, setLike] = useState(props.isLike);
    const songDispatch = useDispatch();
    // window.onbeforeunload = (e) => {
    //     if(isLike){
    //         songDispatch(resetLike(props.name, false))
    //         handleOnClick(false, props.name, props.roomName, false)
    //     } else if(isLike === false){
    //         songDispatch(resetLike(props.name, true))
    //         handleOnClick(true, props.name, props.roomName, false)
    //     }
    // }
    return (
        <Grid>
            <Grid.Column width={7}>
                <Image src={props.image} size='tiny' verticalAlign='middle' centered rounded/>
            </Grid.Column>
            <Grid.Column width={9}>
                <div className='song-info'>
                <strong style={{textOverflow: 'ellipsis'}}>{props.name}</strong>
                <p style={{textOverflow: 'ellipsis'}}>{props.artist}</p>
                </div>
                <div className="like-row">
                    <Button 
                    onClick={() => {
                        setLike(true)
                        if(isLike === null || isLike === false){
                            // songDispatch(userLike(props.name, true))
                            if(isLike === false){
                                handleOnClick(true, props.name, props.roomName, true)
                            } else {
                                handleOnClick(true, props.name, props.roomName, false)
                            }
                        } else if(isLike === true){
                            // songDispatch(userLike(props.name, null))
                            setLike(null)
                            handleOnClick(false, props.name, props.roomName, false)
                        }
                    }} 
                    icon
                    color={isLike ? "green" : "grey"}
                    >
                        <Icon colour={"green"} name="thumbs up outline" size="large" />
                    </Button>
                    <Button 
                    onClick={() => {
                        setLike(false)
                        if(isLike === null || isLike === true){
                            // songDispatch(userLike(props.name, false))
                            if(isLike == true){
                                handleOnClick(false, props.name, props.roomName, true)
                            } else {
                                handleOnClick(false, props.name, props.roomName, false)
                            }
                        } else if(isLike == false){
                            // songDispatch(userLike(props.name, null))
                            setLike(null)
                            handleOnClick(true, props.name, props.roomName, false)
                        }
                    }}
                    icon
                    color={isLike === false ? "red" : "grey"}
                    >
                        <Icon colour={"red"} name="thumbs down outline" size="large" />
                    </Button>
                    <Label size="large">{props.likes}</Label>
                </div>
            </Grid.Column>
        </Grid>
    )
}

export default connect(mapStateToProps)(Song)