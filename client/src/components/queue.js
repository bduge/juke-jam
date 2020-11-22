import React from 'react'
import Song from './song'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return state.queue
}

const Queue = ({ queue }) => {
    if (queue) {
        return Object.keys(queue).map((key, _) => {
            const song = queue[key]
            if (song) {
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
