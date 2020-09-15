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
    console.log('HELLO')
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
        default:
            console.log('Invalid action')
    }
}

const Player = (props) => {
    const [state, dispatch] = useReducer(reducerFunc, intialState)
    const songDispatch = useDispatch()
    useEffect(() => {
        socket.on('song_played', (songURI) => {
            songDispatch(removeSong(songURI))
        })
    }, [])

    const playSong = () => {
        const playOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room: props.room,
            }),
        }
        fetch('http://localhost:8000/spotify/play', playOptions)
            .then((data) => data.json())
            .then((data) => {
                if (!data.ok) {
                    console.log(data.message)
                    return
                }
                let song = data.message
                dispatch({
                    type: 'played',
                    image: song.image,
                    title: song.title,
                    artist: song.artist,
                })
            })
            .catch((error) => console.log(error))
    }

    return (
        <div className="playerContainer">
            <div>
                <div>
                    {!state.title ? <Label content="Nothing Playing" /> : <></>}
                    <Image src={state.image} size="medium" rounded />
                </div>
                <div>
                    <strong>{state.title}</strong>
                    <p>{state.artist}</p>
                </div>
                {state.playing ? (
                    <Icon
                        name="pause circle outline"
                        className="playerButton"
                        size="huge"
                        onClick={() => console.log('PAUSE')}
                    />
                ) : (
                    <Icon
                        name="play circle outline"
                        className="playerButton"
                        size="huge"
                        onClick={playSong}
                    />
                )}
            </div>
        </div>
    )
}

export default Player
