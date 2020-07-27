import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import createRoom from './components/createRoom';
import homepage from './components/homepage';
import newRoom from './components/newRoom';


export default class App extends React.Component {
  render(){
    return(
      <Router>
      <div>
        <Switch>
          <Route path="/" exact component={homepage}/>
          <Route path="/create-room" component={createRoom}/>
		  <Route path="/new-room" component={newRoom}/>
        </Switch>
      </div>
      </Router>
    )
  }
}
