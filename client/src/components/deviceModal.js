import React from 'react'
import './styles.css'
import { Modal, Button, Icon } from 'semantic-ui-react'
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
        this.renderDevices = this.renderDevices.bind(this)
    }

    componentDidMount() {
        this.getDevices()
    }

    async getDevices() {
        this.setState({ loading: true })
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomName: this.props.roomName,
            }),
        }

        let children = []
        try {
            let devices = await fetch(
                'http://localhost:8000/spotify/get_devices',
                requestOptions
            )
            devices = await devices.json()
            console.log(devices)
            for (const device of devices) {
                children.push(device)
            }
            this.setState({
                devices: children,
                loading: false,
            })
        } catch (error) {
            console.log(error)
        }
    }

    renderDevices() {
        return this.state.devices.map((device) => {
            return (
                <Device
                    key={device.id}
                    id={device.id}
                    name={device.name}
                    type={device.type}
                />
            )
        })
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
                    <Button
                        onClick={this.getDevices}
                        style={{ float: 'right' }}
                    >
                        Refresh
                    </Button>
                </Modal.Header>
                <div id="deviceContainer">{this.renderDevices()}</div>
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
