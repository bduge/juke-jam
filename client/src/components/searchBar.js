import React from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'

const initialState = {
    loadingState: false,
    results: [],
}

const reducerFunc = (state, action) => {
    switch (action.type) {
        case 'NO_SEARCH':
            return {...state, loadingState: false, results: null};
        case 'START_SEARCH':
            return {...state, loadingState: true, results: null, value: action.query}
        case 'FINISH_SEARCH':
            return {...state, loadingState: false, results: action.results}
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
            />
            </Grid.Column>
        </Grid>
    )
}

export default SearchBar