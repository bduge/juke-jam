export const addSong = (songObj) => {
    return {
        type: 'ADD_SONG',
        song: songObj, 
    }
}