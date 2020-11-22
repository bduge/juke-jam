import React, { useEffect, useRef } from 'react'
import { Search, Grid, Popup } from 'semantic-ui-react'
import { socket } from './socketConnection'
import { useDispatch } from 'react-redux'
import { addSong, changeLike } from '../actions/actions'

const initialState = {
    loadingState: false,
    results: [],
    value: '',
}

const selectSong = (songObj, roomName) => {
    console.log("selectSong")
    console.log(songObj)
    let sendSongOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            song: songObj,
            roomName: roomName,
        }),
    }
    fetch('http://localhost:8000/add_song', sendSongOptions)
        .then((data) => data.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.log(error))
}

const reducerFunc = (state, action) => {
    switch (action.type) {
        case 'NO_SEARCH':
            return { ...state, loadingState: false, results: null, value: '' }
        case 'START_SEARCH':
            return {
                ...state,
                loadingState: true,
                results: null,
                value: action.query,
            }
        case 'FINISH_SEARCH':
            return { ...state, loadingState: false, results: action.results }
        case 'SELECT_SONG':
            selectSong(action.selection, action.roomName)
            return {
                ...state,
                loadingState: false,
                searchDone: true,
                value: '',
            }
        default:
            console.log('ERROR')
    }
}

const SearchBar = (props) => {
    const [state, dispatch] = React.useReducer(reducerFunc, initialState)
    const { loadingState, results, value } = state
    const songDispatch = useDispatch()

    useEffect(() => {
        console.log("Use Effect Ran")
        socket.on('queue_update', (song) => {
            // console.log(song)
            songDispatch(addSong(song))
            
        })
        socket.on('changeLike', (song) => {
            // console.log(song)
            songDispatch(changeLike(song))
        })
    }, [])

    //Search Song Function
    const searchSong = (event) => {
        if (event.target.value.length === 0) {
            dispatch({ type: 'NO_SEARCH' })
            return
        }
        dispatch({ type: 'START_SEARCH', query: event.target.value })
        let searchVal = event.target.value
        let searchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                searchString: searchVal,
                roomName: props.roomName,
            }),
        }
        fetch('http://localhost:8000/spotify/search', searchOptions)
            .then((data) => data.json())
            .then((data) => {
                dispatch({
                    type: 'FINISH_SEARCH',
                    results: data,
                })
            })
            .catch((error) => console.log(error))
    }

    return (
        <Grid>
            <Grid.Column width={6}>
                <Search
                    loading={loadingState}
                    onSearchChange={searchSong}
                    results={results}
                    value={value}
                    onResultSelect={(e, data) => {
                        dispatch({
                            type: 'SELECT_SONG',
                            selection: data.result,
                            roomName: props.roomName,
                        })
                    }}
                />
            </Grid.Column>
        </Grid>
    )
}

export default SearchBar
