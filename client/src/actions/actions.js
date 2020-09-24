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

export const exitAction = () => {
    return {
        type: 'EXIT'
    }
}

export const userLike = (songTitle, isLike) => {
    return {
        type: 'USER_LIKE',
        songTitle: songTitle,
        isLike: isLike
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

export const addSongArr = (songArr) => {
    return {
        type: "ADD_SONG_ARRAY",
        songArr: songArr
    }
}

export const setIsHost = (isHost) => {
    return {
        type: 'SET_IS_HOST',
        isHost: isHost, 
    }
}

export const removeSong = (songURI) => {
    console.log('Removing', songURI)
    return {
        type: 'REMOVE_SONG',
        uri: songURI,
    }
}
