import React from 'react'
import './styles.css'
import { Grid, Image, Icon, Popup} from 'semantic-ui-react'

class Song extends React.Component {

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
