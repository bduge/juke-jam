import React from 'react';
import {Container, Header, Button, Grid, Icon, Segment, List} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Particles from 'react-particles-js';
import {Link as LinkScroll, animateScroll as scroll} from 'react-scroll';

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
                content='JUKE JAM'
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
            <Grid.Row columns={1} className="center">
                <LinkScroll to='helpSection' spy={true} smooth={true} duration={1000}>
                    <div style={{position:"absolute", bottom:60, left:"50%"}}>
                        <Icon style={{position:"relative", left:"-50%"}} className="const-hvr-pulse" name="arrow alternate circle down" color="blue" size="huge"/>
                    </div> 
                </LinkScroll>
            
            </Grid.Row>
            <Grid.Row style={{position:"absolute", bottom:"-20em", width:"100%", left:0}}>
            <div id='helpSection'>
            <Segment id='helpSection' placeholder inverted color='blue' textAlign='center'>
                <Header style={{margin:'auto', width:'50%'}} size='huge' as='h2'>
                    GETTING STARTED
                </Header>
                <List style={{margin:'auto', width:'50%'}} divided size='huge'>
                    <List.Item>
                        <List.Icon name="edit"/>
                        <List.Content>Create a room</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="keyboard"/>
                        <List.Content>Login with your spotify credentials</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="hand point right outline"/>
                        <List.Content>Select a device to play off of</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="handshake outline"/>
                        <List.Content>Invite your friends using the shareable link or just give them the room name</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="heart outline"/>
                        <List.Content>Enjoy the music!</List.Content>
                    </List.Item>
                </List>
            </Segment>
            </div>

            </Grid.Row>


        </Container>
    )
}