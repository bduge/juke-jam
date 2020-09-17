import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import CreateRoom from './components/createRoom';
import homepage from './components/homepage';
import Room from './components/room';
import JoinRoom from './components/joinRoom';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

export default class App extends React.Component {


  render(){ 
    return(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
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
        </PersistGate>
      </Provider>
    )
  }
}
