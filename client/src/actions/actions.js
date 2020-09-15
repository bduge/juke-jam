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

export const setRoomName = (roomName) => {
    console.log('being called')
    console.log(roomName)
    return {
        type: 'SET_ROOM_NAME',
        roomName: roomName,
    }
}

export const removeSong = (songURI) => {
    console.log('Removing', songURI)
    return {
        type: 'REMOVE_SONG',
        uri: songURI,
    }
}
