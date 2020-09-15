export const addSong = (songObj) => {
    return {
        type: 'ADD_SONG',
        song: songObj, 
    }
}

export const changeLike = (songObj) => {
    return {
        type: 'CHANGE_LIKE',
        song: songObj, 
    }
}

export const resetLike = (songTitle, isIncrease) => {
    return {
        type: 'RESET_LIKE',
        songTitle: songTitle,
        isIncrease: isIncrease, 
    }
}

export const setRoomName = (roomName) => {
    console.log("being called")
    console.log(roomName)
    return {
        type: 'SET_ROOM_NAME',
        roomName: roomName
    }
}