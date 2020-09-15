let initialState = {
    queue: [],
}
const queueReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_SONG':
            return Object.assign({}, state, {
                queue: [...state.queue, action.song],
            })

        case 'REMOVE_SONG':
            return {
                ...state,
                queue: state.queue.filter((song) => song.uri != action.uri),
            }

        case 'CHANGE_LIKE':
            return Object.assign({}, state, {
                queue: state.queue.map((song) => {
                    if (song.title === action.song.title) {
                        return Object.assign({}, song, {
                            likes: action.song.likes,
                        })
                    } else {
                        return song
                    }
                }),
            })
        case 'RESET_LIKE':
            console.log("RESET_LIKE")
            return Object.assign({}, state, {
                queue: state.queue.map((song) => {
                    if(song.title === action.songTitle){
                        if(action.isIncrease){
                            return Object.assign({}, song, {
                                likes: song.likes++
                            })
                        } else if(action.isIncrease === false){
                            console.log("DECREASE")
                            console.log(song.likes--)
                            return Object.assign({}, song, {
                                likes: song.likes--
                            })
                        }
                    } else {
                        return song
                    }
                })
            })
        default:
            return state
    }
}

export default queueReducer
