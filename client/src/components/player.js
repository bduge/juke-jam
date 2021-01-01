import React, { useReducer, useEffect } from 'react'
import { Button, Icon, Image, Label } from 'semantic-ui-react'
import { socket } from './socketConnection'
import { useDispatch } from 'react-redux'
import { removeSong } from '../actions/actions'

const intialState = {
    image: null,
    title: null,
    artist: null,
    playing: false,
}

const reducerFunc = (state = intialState, action) => {
    switch (action.type) {
        case 'played':
            return {
                ...state,
                image: action.image,
                title: action.title,
                artist: action.artist,
                playing: true,
            }
        case 'paused':
            return {
                ...state,
                playing: false,
            }
        case 'initial':
            return {
                ...state,
                image: action.song.image,
                title: action.song.title,
                artist: action.song.artist,
                playing: !action.song.paused,
            }
        default:
            console.log('Invalid action')
    }
}

const Player = (props) => {
    const [state, dispatch] = useReducer(reducerFunc, intialState)
    const songDispatch = useDispatch()
    useEffect(() => {
        socket.on('song_played', (song) => {
            songDispatch(removeSong(song.uri))
            dispatch({
                type: 'played',
                image: song.image,
                title: song.title,
                artist: song.artist,
            })
        })
        let fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room: props.room,
            }),
        }
        fetch(`${process.env.REACT_APP_API_URL}/get_current_song`, fetchOptions)
            .then((data) => data.json())
            .then((data) => {
                if (data.title) {
                    dispatch({ type: 'initial', song: data })
                }
            })
    }, [])

    const playSong = (skip = false) => {
        let resume = false
        if (!skip && state.title) {
            resume = true
        }
        const playOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room: props.room,
                resume: resume,
            }),
        }
        fetch(`${process.env.REACT_APP_API_URL}/spotify/play`, playOptions)
            .then((data) => data.json())
            .then((data) => {
                if (!data.ok) {
                    console.log(data.message)
                    return
                }
            })
            .catch((error) => console.log(error))
    }

    const pauseSong = () => {
        const pauseOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room: props.room,
            }),
        }
        fetch(`${process.env.REACT_APP_API_URL}/spotify/pause`, pauseOptions)
            .then((data) => data.json())
            .then((data) => {
                if (!data.ok) {
                    console.log(data.message)
                }
                dispatch({ type: 'paused' })
            })
            .catch((error) => console.log(error))
    }

    return (
        <div className="playerContainer">
                <div>
                    {!state.title ? <Label content="Nothing Playing" /> : <></>}
                    <Image src={state.image} size="medium" rounded />
                </div>
                <div style={{margin: '0.5em'}}>
                    <strong>{state.title}</strong>
                    <p>{state.artist}</p>
                </div>
                <div>
                {state.playing ? (
                    <Icon
                        name="pause circle outline"
                        className="playerButton"
                        size="huge"
                        onClick={pauseSong}
                    />
                ) : (
                    <Icon
                        name="play circle outline"
                        className="playerButton"
                        size="huge"
                        onClick={() => {
                            console.log(props.deviceConnected == true)
                            if(props.deviceConnected !== true){
                                props.triggerPopup(true);
                            } else {
                                playSong(false)
                                props.triggerPopup(false);
                            }
                        }}
                    />
                )}
                <Icon
                    name="step forward"
                    className="playerButton"
                    size="big"
                    onClick={() => playSong(true)}
                />
                </div>
            </div>
    )
}

export default Player
