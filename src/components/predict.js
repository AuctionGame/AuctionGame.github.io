import React from 'react';
import MyCard from './card';
import LoginHandler from './LoginHandler';

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
      loginId: '',
      loginFail: false
    };

    this.handleFailDialogClose = this.handleFailDialogClose.bind(this);
    this.loginSubmitHandler = this.loginSubmitHandler.bind(this);
  }


  loginSubmitHandler(val) {
    console.log("Login In prediction submit function", val);

    const db = firebase.firestore()
    db.collection('predictions').doc(val).get().then((doc) => {
      if (doc.exists) {
        // login successful
        this.setState({
          loginId : val
        })

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
        

      }  else {
        this.setState({
          loginFail: true
        });
      } 
  })

  }


  /* This function just closes the dialog */
  handleDialogClose = () => {
    this.setState({ open: false });
  };

  handleFailDialogClose() {
    this.setState({
      loginFail: false
    })
  }

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
      this.handleDialogOpen(players[0], number);
    } else {
      console.log('Already Predicted this one');
    }
  }


  render() {

    // First check if loggined
    if (this.state.loginId) {

      const predictionArray = this.state.predictionArray;

      // If they ahve predicted all
      if (predictionArray.length >= 7) {
        // Change this to something better - TO BE DONE BY DEEEEPPPAAAALLLIIIII!
        const items = [];
        predictionArray.map((element) => {
          items.push(players[element]);
          return false;
        });

        return <div id="done-all-predictions">{items}</div>;
      } else {
        // It's better to use map, however we are usign let for this
        const items = [];
        for (let i = 1; i <= 60; i++) {
          var imgSrc = 'cpng/' + i + '.jpg';
          var status = this.state.predictionArray.includes(i);
          items.push(
            <MyCard
              key={i}
              img={imgSrc}
              name={players[i]}
              status={status}
              type="Bowler"
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
    } // End of login if
    else {
      return (
        <div id="prediction-login">
          <h1 className="center">Prediction Roud Login</h1>
          <LoginHandler
            submitHandler={this.loginSubmitHandler}
          />

          <Dialog
            open={this.state.loginFail}
            onClose={this.handleFailDialogClose}
            aria-labelledby="Login Failed"
            aria-describedby="Fail dialog"
          >
            <DialogTitle id="alert-dialog-title">
              Login Unsuccessful
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please check you secret Id and try again!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleFailDialogClose} color="primary">
                close
              </Button>
            </DialogActions>
          </Dialog>

        </div>

      )
    }
  } // End of render
}

export default Predict;
