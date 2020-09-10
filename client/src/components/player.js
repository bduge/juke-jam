import React, { useReducer } from 'react'
import { Button, Icon, Image, Label } from 'semantic-ui-react'

const intialState = {
    image: null,
    title: null,
    artist: null,
    playing: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_song':
            return {
                image: action.image,
                title: action.title,
                artist: action.artist,
                playing: true,
            }
        case 'pause':
            return {
                ...state,
                playing: false,
            }
        default:
            console.log('Invalid action')
    }
}

const Player = (props) => {
    const [state, dispatch] = useReducer(reducer, intialState)

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
            .then((data) => console.log(data.message))
            .catch((error) => console.log(error))
    }
    return (
        <div className="playerContainer">
            <div>
                <Image src={state.image} size="small">
                    {!state.title ? <Label content="Nothing Playing" /> : <></>}
                </Image>
            </div>
            <div>
                <strong>{state.title}</strong>
                {state.artist}
            </div>
            {state.playing ? (
                <Icon
                    name="pause circle outline"
                    className="playerButton"
                    size="large"
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
    )
}

export default Player
