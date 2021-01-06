import React from 'react'
import Song from './song'
import { connect } from 'react-redux'
import { Transition, List, Container } from 'semantic-ui-react'

const mapStateToProps = (state) => {
    return state.queue
}

const Queue = ({ queue }) => {
    if (queue) {
        return (
        <Transition.Group as='div' duration={200} animation='fade'>
        {Object.keys(queue).map((key, _) => {
            const song = queue[key]
            if (song) {
                return (
                    <Container>
                        <Song
                            key={song.title + song.artist}
                            name={song.title}
                            artist={song.artist}
                            likes={song.likes}
                            image={song.image}
                            isLike={song.isLike}
                        />
                    </Container>
                )
            } else {
                return null
            }
        })}
        </Transition.Group>
        )
    } else {
        return null
    }
}

export default connect(mapStateToProps)(Queue)
