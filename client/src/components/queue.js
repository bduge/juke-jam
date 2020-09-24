import React from 'react'
import Song from './song'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return state.queue
}

// const sortFunc = (songObj1, songObj2) => {
//     if(songObj1.likes > songObj2.likes){
//         console.log("1")
//         return 1
//     } else if(songObj1.likes < songObj2.likes){
//         console.log("-1")
//         return -1 
//     } else {
//         console.log("0")
//         return 0
//     }

// }

const Queue = ({queue}) => {
    if(queue){
        // console.log(queue)
        // let sortedQueue = queue.sort(sortFunc)
        // console.log(sortedQueue)
        // for(var i = 0; i < sortedQueue.length; i++){
        //     const song = queue[i]
        //     if(song){
        //         return(
        //             <Song
        //                 key={song.title + song.artist}
        //                 name={song.title}
        //                 artist={song.artist}
        //                 likes={song.likes}
        //                 image={song.image}
        //             />
        //         )
        //     } else {
        //         return null
        //     }
            
        // }
        return Object.keys(queue).map((key, _) => {
            const song = queue[key]
            if(song){
                return (
                    <Song
                        key={song.title + song.artist}
                        name={song.title}
                        artist={song.artist}
                        likes={song.likes}
                        image={song.image}
                    />
                )
            } else {
                return null
            }
        })
    } else {
        return null
    }
    
}

export default connect(mapStateToProps)(Queue)