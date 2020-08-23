import React from 'react';
import Card from './card';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import firebase from 'firebase/app';
import 'firebase/firestore';
import players from '../data/players.json';

class Predict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      predictionArray: [],
      open: false,
      dialogName: 'Confirm',
      confirmNumber: 0,
      loginId: 'teamId',
    };
  }

  /* This function just closes the dialog */
  handleDialogClose = () => {
    this.setState({ open: false });
  };

  /* This function handles the confirm prediciton dialog */
  handleDialogOpen = (title, number) => {
    this.setState({
      dialogName: `Confirm ${title}`,
      open: true,
      confirmNumber: number,
    });
  };

  /* Finall add on yes button pressed */
  handlePlayerConfirm = () => {
    // Store the current prediction array and check if already included
    const number = this.state.confirmNumber;
    const index = this.state.predictionArray.length;
    var newP = {};
    newP[index] = number;

    // Update the firebase with this data
    // The prediction array will be automatically updated due to firesbase snapshot
    firebase
      .firestore()
      .collection('predictions')
      .doc(this.state.loginId)
      .set(newP, { merge: true });

    // Finally update the current state of this class
    this.setState({
      open: false,
    });
  };

  addPrediction(number) {
    console.log('Add Prediction called');
    console.log(number);

    if (!this.state.predictionArray.includes(number)) {
      this.handleDialogOpen(this.players[0], number);
    } else {
      console.log('Already Predicted this one');
    }
  }

  // Add this later to be done after the login
  componentDidMount() {
    const db = firebase.firestore();
    db.collection('predictions')
      .doc(this.state.loginId)
      .onSnapshot(
        (snap) => {
          const predictionData = snap.data();
          console.log('Prediction data', predictionData);

          // Create the prediction array from the dictionary type of
          // {0: pNo, 1: pNo, ....}
          var predictionArray = [];
          for (var key in predictionData) {
            predictionArray.push(predictionData[key]);
          }

          this.setState({
            predictionArray: predictionArray,
          });
        },
        (err) => {},
      );
  }

  render() {
    const predictionArray = this.state.predictionArray;

    // If they ahve predicted all
    if (predictionArray.length >= 7) {
      // Change this to something better
      const items = [];
      predictionArray.map((element) => {
        items.push(element);
      });

      return <div id="done-all-predictions">{items}</div>;
    } else {
      // It's better to use map, however we are usign let for this
      const items = [];
      for (let i = 1; i <= 60; i++) {
        var imgSrc = 'cpng/' + i + '.jpg';
        var status = this.state.predictionArray.includes(i);
        items.push(
          <Card
            key={i}
            img={imgSrc}
            name={this.players[0]}
            status={status}
            handler={() => this.addPrediction(i)}
          />,
        );
      }

      return (
        <div id="prediction-gallery">
          <h2 className="center">Make your predictions</h2>
          <div className="container">
            <div className="row">{items}</div>
          </div>

          {/* Here is the dialog box */}
          <Dialog
            open={this.state.open}
            onClose={this.handleDialogClose}
            aria-labelledby="Confirm Dialog"
            aria-describedby="Alert dialog"
          >
            <DialogTitle id="alert-dialog-title">
              {this.state.dialogName}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to go with this?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose} color="primary">
                No
              </Button>
              <Button
                onClick={this.handlePlayerConfirm}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    } // End of all done else
  } // End of render
}

export default Predict;
