import React from 'react'
import './styles.css'
import { Grid, Image, Icon, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { socket } from './socketConnection'

class Song extends React.Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     likes: this.props.likes || 0,
        // }
    }

    render() {
        return (
            <Grid>
                <Grid.Column width={4}>
                    <Image src={this.props.image} size="tiny" />
                </Grid.Column>
                <Grid.Column width={12}>
                    <strong>{this.props.name}</strong>

                    <p>{this.props.artist}</p>
                    {this.props.inQueue ? (
                        <div>
                            <Icon name="angle up" size="large" />
                            <Icon name="angle down" size="large" />
                        </div>
                    ) : (
                        <></>
                    )}
                </Grid.Column>
            </Grid>
        )
    }
}

export default Song
