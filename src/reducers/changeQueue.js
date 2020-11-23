let initialState = {
    queue: [],
}

const sortQueue = (song1, song2) => {
    return song1.likes > song2.likes ? -1 : song2.likes > song1.likes ? 1 : 0
}

const queueReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_SONG':
            let songObj = action.song
            songObj.isLike = null
            let newQueue = [...state.queue]
            newQueue.push(songObj)
            return Object.assign({}, state, {
                queue: newQueue.sort(sortQueue),
            })
        case 'REMOVE_SONG':
            return {
                ...state,
                queue: state.queue.filter((song) => song.uri != action.uri),
            }
        case 'ADD_SONG_ARRAY':
            let songArr = action.songArr
            songArr.forEach((item) => {
                item.isLike = null
            })
            return {
                ...state,
                queue: state.queue.concat(songArr).sort(sortQueue),
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
                }).sort(sortQueue),
            })
        case 'USER_LIKE':
            return Object.assign({}, state, {
                queue: state.queue.map((song) => {
                    if (song.title === action.songTitle) {
                        return Object.assign({}, song, {
                            isLike: action.isLike,
                        })
                    }
                }).sort(sortQueue),
            })
        case 'RESET_LIKE':
            console.log('RESET_LIKE')
            return Object.assign({}, state, {
                queue: state.queue.map((song) => {
                    if (song.title === action.songTitle) {
                        if (action.isIncrease) {
                            return Object.assign({}, song, {
                                likes: song.likes++,
                            })
                        } else if (action.isIncrease === false) {
                            console.log('DECREASE')
                            console.log(song.likes--)
                            return Object.assign({}, song, {
                                likes: song.likes--,
                            })
                        }
                    } else {
                        return song
                    }
                }),
            })
        default:
            return state
    }
}

export default queueReducer
