import React from 'react';
import {Container, Header, Button, Grid, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default function homepage() {
    return (
        <Container className="headerStyle" text>
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
                <Button className="buttonStyle" animated basic size={"huge"} color={"blue"}>
                    <Button.Content visible>Join a Room</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow right' />
                    </Button.Content>
                </Button>
            </Grid.Row>
        </Container>
    )
}