import React from 'react'
import { Search, Grid} from 'semantic-ui-react'

const initialState = {
    loadingState: false,
    results: [],
}

const selectSong = (songObj, roomName) => {
    let sendSongOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            song: songObj,
            roomName: roomName
        })
    }
    fetch("http://localhost:8000/spotify/ENDPOINT", sendSongOptions)
    .then(() => console.log("SUCCESS"))
    .catch(error => console.log(error));
        
}

const reducerFunc = (state, action) => {
    switch (action.type) {
        case 'NO_SEARCH':
            return {...state, loadingState: false, results: null};
        case 'START_SEARCH':
            return {...state, loadingState: true, results: null, value: action.query}
        case 'FINISH_SEARCH':
            return {...state, loadingState: false, results: action.results}
        case 'SELECT_SONG':
            selectSong(action.selection, action.roomName);
            return {...state, loadingState: false}
        default:
            console.log("ERROR")
    }
}

const SearchBar = (props) => {
    const [state, dispatch] = React.useReducer(reducerFunc, initialState);
    const { loadingState, results } = state;
    const searchSong = (event) => {
        if(event.target.value.length === 0){
            dispatch({type: 'NO_SEARCH'});
            return; 
        }
        dispatch({ type: 'START_SEARCH', query: event.target.value})
        let searchVal = event.target.value;
        let searchOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                searchString: searchVal, 
                roomName: props.roomName
            }),
        };
        fetch("http://localhost:8000/spotify/search", searchOptions)
        .then(data => data.json())
        .then(data => {
            dispatch({ 
                type: 'FINISH_SEARCH',
                results: data,
            });
        })
        .catch(error => console.log(error));
    }

    return(
        <Grid>
            <Grid.Column width={6}>
            <Search
            loading={loadingState}
            onSearchChange={searchSong}
            results={results}
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