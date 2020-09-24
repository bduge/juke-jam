
export const roomNameReducer = (state = "", action) => {
    switch(action.type) {
        case 'SET_ROOM_NAME': 
            return action.roomName
        default:
            return state 
    }
}

export const isHostReducer = (state = "", action) => {
    switch(action.type) {
        case 'SET_IS_HOST':
            return action.isHost
        default: 
            return state
    }
}
