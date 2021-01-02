import React from 'react'
import './styles.css'
import { Modal, Button, Icon, Popup } from 'semantic-ui-react'
import Device from './device'

class DeviceModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
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
                `${process.env.REACT_APP_API_URL}/spotify/get_devices`,
                requestOptions
            )
            devices = await devices.json()
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
                <Button
                    style={{margin: '0.5em'}}
                    key={device.id}
                    onClick={() => { this.props.saveDevice(device.id, device.name) }}
                >
                    <Device
                        key={device.id}
                        id={device.id}
                        name={device.name}
                        type={device.type}
                    />
                </Button>
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
                        {this.props.deviceName
                            ? 'Playing on ' + this.props.deviceName
                            : 'Devices'}
                    </Button>
                }
            >
                <Modal.Header>
                    <div className='modalHeader'>
                        <div>
                        Devices
                        <Popup trigger={<Icon name='info circle' style={{ marginLeft: '0.5em'}}/>}content="If a device isn't appearing, make sure the Spotify app is open"/>
                        </div>
                        <Button
                            onClick={this.getDevices}
                            className='refreshButton'
                            // style={{ float: 'right' }}
                        >
                            Refresh
                        </Button>
                    </div>
                   
                    
                </Modal.Header>
                <Modal.Content>
                    <div id="deviceContainer">{this.renderDevices()}</div>
                </Modal.Content>
            </Modal>
        )
    }
}

export default DeviceModal
