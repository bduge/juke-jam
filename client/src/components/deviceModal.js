import React from 'react'
import './styles.css'
import { Modal, Button, Icon, Loader } from 'semantic-ui-react'
import Device from './device'

class DeviceModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            selectedId: this.props.active || null,
            devices: this.props.devices || [],
            loading: true,
        }
        this.getDevices = this.getDevices.bind(this)
    }

    componentDidMount() {
        this.getDevices()
    }

    async getDevices() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomName: this.props.roomName,
            }),
        }

        let children = []
        fetch('http://localhost:8000/spotify/get_devices', requestOptions)
            .then((data) => data.json())
            .then((devices) => {
                for (const device of devices) {
                    console.log(device)
                    children.push(
                        <Device
                            key={device.id}
                            id={device.id}
                            name={device.name}
                            type={device.type}
                        />
                    )
                }
            })
            .then(
                this.setState({
                    devices: children,
                    loading: false,
                })
            )
            .catch((error) => console.log(error))
    }

    render() {
        return (
            <Modal
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
                open={this.state.open}
                trigger={
                    <Button>
                        <Icon name="mobile" />
                        Device
                    </Button>
                }
            >
                <Modal.Header>
                    Devices
                    <Button onClick={this.getDevices}>Refresh</Button>
                </Modal.Header>
                <Modal.Content>
                    {this.state.loading ? (
                        <Loader content="Loading" active inverted />
                    ) : (
                        <div id="deviceContainer">{this.state.devices}</div>
                    )}
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" onClick={this.props.saveDevice}>
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default DeviceModal
