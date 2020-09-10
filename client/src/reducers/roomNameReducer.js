
const roomNameReducer = (state = "", action) => {
    switch(action.type) {
        case 'SET_ROOM_NAME': 
            console.log("ITS GETTING HERE")
            return action.roomName
        default:
            return state 
    }
}

export default roomNameReducer 