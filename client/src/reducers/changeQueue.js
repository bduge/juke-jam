let initialState = {
    queue: []
}
const queueReducer = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_SONG':
            return {
                ...state,
                queue: [...state.queue, action.song]
            }
        default:
            return state
    }
}

export default queueReducer