import React from 'react';
import SimplePlayerCard from './SimplePlayerCard';
import Button from '@material-ui/core/Button'

import firebase from 'firebase/app';
import 'firebase/firestore';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Stats from './Stats';
import playerNames from '../data/players.json';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soldDict: {},
      toOpen: false,
      currentClick: 1
    };
    //this.handleDialogOpen = this.handleDialogOpen.bind(this)
  }

  handleFailDialogClose = () => {
    this.setState({
      toOpen: false
    })
  }

  handleDialogOpen(i){
    this.setState({
      toOpen: true,
      currentClick: i
    })
    console.log("handle dialog open" , i)
  }

  componentDidMount() {
    // Here we will extract the data from firebase
    const db = firebase.firestore();

    db.collection('team_players').onSnapshot(
      (snap) => {
        var soldDict = {};
        snap.forEach((doc) => {
          const data = doc.data();
          for (var key in data) {
            soldDict[key] = data[key];
          }
        });

        // Finally update the ones who are sold
        this.setState({
          soldDict: soldDict,
        });
      },
      (err) => {
        console.log('Fetch Failed');
      },
    );
  }

  render() {
    const soldDict = this.state.soldDict;

    const array = [];
    for (let i = 1; i <= 60; i++) {
      array.push(i);
    }

    const elementArr = array.map(i => (
      <SimplePlayerCard key={i} value={i} sold={true} handler={() => this.handleDialogOpen(i)} price={soldDict[i]} colSize="3" />
    ))

    return (
      <div className="container">
        <div className="row">{elementArr}</div>

          <Dialog
          open={this.state.toOpen}
          onClose={this.handleFailDialogClose}
          aria-labelledby="Login Failed"
          aria-describedby="Fail dialog"
        >
          <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
           {playerNames[this.state.currentClick]}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Stats playerNo={this.state.currentClick} /> 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleFailDialogClose}
              color="primary"
              autoFocus
            >
              close
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

export default Player;
