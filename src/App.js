import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/firestore';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Home from './components/home';
import Player from './components/players';
import Teams from './components/teams';
import Quiz from './components/quiz';
import Messages from './components/messages';

class App extends React.Component {
  constructor() {
    super();

    // setting the inital state of the App
    this.state = {
      tabValue: 0,
      round: 'quiz',
      messages: ['Hello message 1', 'hello message 2', 'Hello message 3']
    };

    // Don't forget to bind the functions to classes
    this.handleChange = this.handleChange.bind(this);
  }

  /* ----- Add functions here ----- */
  updateRound(round) {
    this.setState({
      round: round,
    });
  }

  handleChange(event, newValue) {
    this.setState({
      tabValue: newValue,
    });
    console.log('Handle Change', newValue);
  }

  /* ----- Add Firebase details here ------ */
  // Add firebase updates and listener here
  componentDidMount() {
    const db = firebase.firestore();
    const doc = db.collection('admin').doc('current');

    doc.onSnapshot(
      (snap) => {
        console.log('Recieved Round Info', snap.data().pid);
        // this.updateRound(snap.data().pid);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      },
    );
  }

  render() {
    // First check for the Quiz Round from the firebase
    const round = this.state.round;

    // Check for the quiz round!
    if (round === '...') {
      return <h1 id="loading">Loading ...</h1>;
    } else if (round === 'quiz') {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-8">
              <Quiz />
            </div>
            <div className="col-sm-4">
              <Messages />
            </div>
          </div>
        </div>
      ) ;
    } else {
      // The main content and routes everything
      return (
        <Router>
          <AppBar position="static" color="transparent" id="nav-bar">
            <Tabs
              variant="fullWidth"
              aria-label="Navigation"
              value={this.state.tabValue}
              onChange={this.handleChange}
            >
              <Tab label="Home" to="/" component={Link} />
              <Tab label="Players" to="/players" component={Link} />
              <Tab label="Teams" to="/teams" component={Link} />
            </Tabs>
          </AppBar>

          <div id="main-content">
            <Switch>
              <Route path="/players">
                <Player />
              </Route>
              <Route path="/teams">
                <Teams />
              </Route>
              <Route path="/">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-8">
                    <Home round={this.state.round} />
                  </div>
                  <div className="col-sm-4">
                    <Messages />
                  </div>
                </div>
              </div>
              </Route>
            </Switch>
          </div>
        </Router>
      );
    }
  } // End of render
}

export default App;
