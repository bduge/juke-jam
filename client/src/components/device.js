import React from 'react'
import './styles.css'
import { Icon } from 'semantic-ui-react'

export default class Device extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: this.props.selected || false,
        }
    }

    setActive = () => {
        this.setState({ selected: true })
    }
    setInactive = () => {
        this.setState({ selected: false })
    }

    getIcon = () => {
        switch (this.props.type) {
            case 'Smartphone':
                return 'mobile'
            case 'Computer':
                return 'computer'
            case 'TV':
                return 'tv'
            case 'Tablet':
                return 'tablet'
            default:
                return 'headphones'
        }
    }
    render() {
        return (
            <div className="device">
                <Icon name={this.getIcon()} size="large" />
                <h5>{this.props.name}</h5>
            </div>
        )
    }
}
