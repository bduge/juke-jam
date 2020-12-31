import React from 'react';
import {Container, Header, Button, Grid, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Particles from 'react-particles-js';

export default function homepage() {
    return (
        <Container className="headerStyle" text>
            <Particles
            id="particles-js"
            params={{particles: {
                number: {
                    value: 75,
                },
                shape: {
                    type: "image",
                    image: {
                        src: "https://drive.google.com/uc?id=1vOyv0fH2faWdU0lI9WPSzceBKRjHB3XD"
                    }
                },
                opacity: {
                    value: 0.5,
                    anim: {
                        enable: true
                    }
                },
                size: {
                    value: 15,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 3
                    }
                },
                line_linked: {
                    enable: false
                },
                move: {
                    speed: 0.2
                }
             }    
        }}  
            />
            <Header
                className="headerTextMain"
                textAlign={"center"}
                as='h1'
                content='JUKE-JAM'
            />
            <Header
                className="headerTextSecondary"
                textAlign={"center"}
                as="h2"
                content="Never Stop the Music"
            />
            <Grid.Row columns={2} className="center">
                <Link to="/create-room">
                <Button className="buttonStyle" animated basic size={"huge"} color={"blue"}>
                    <Button.Content visible>Create a Room</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow right' />
                    </Button.Content>
                </Button>
                </Link>
                <Link to="/join-room">
                <Button className="buttonStyle" animated basic size={"huge"} color={"blue"}>
                    <Button.Content visible>Join a Room</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow right' />
                    </Button.Content>
                </Button>
                </Link>
            </Grid.Row>
        </Container>
    )
}