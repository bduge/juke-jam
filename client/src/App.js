import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import CreateRoom from './components/createRoom';
import homepage from './components/homepage';
import Room from './components/room';
import JoinRoom from './components/joinRoom';

export default class App extends React.Component {
  constructor(props){
    super(props);
  }

  render(){ 
    return(
      <Router>
      <div>
        <Switch>
          <Route path="/" exact component={homepage}/>
          <Route path="/create-room" component={CreateRoom}/>
          <Route path="/room/:roomId" component={Room}/>
          <Route path="/join-room" component={JoinRoom}/>
        </Switch>
      </div>
      </Router>
    )
  }
}
