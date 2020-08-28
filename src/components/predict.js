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
          loginId: val
        })

        const db = firebase.firestore();
        db.collection('predictions')
          .doc(this.state.loginId)
          .onSnapshot(
            (snap) => {
              const predictionData = snap.data()["predictionArray"];
              console.log('Prediction data', predictionData);

              this.setState({
                predictionArray: predictionData,
              });
            },
            (err) => { },
          );


      } else {
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
  handleDialogOpen = () => {
    this.setState({
      dialogName: "You're about to submit",
      open: true,
    });
  };

  /* Finall add on yes button pressed */
  handlePlayerConfirm = () => {
    const predictionArray = this.state.predictionArray;


    var predictionArrayDict = {}
    predictionArrayDict["predictionArray"] = predictionArray

    // Update the firebase with this data
    // The prediction array will be automatically updated due to firesbase snapshot

    firebase
      .firestore()
      .collection('predictions')
      .doc(this.state.loginId)
      .set(predictionArrayDict);

    // Finally update the current state of this class
    this.setState({
      open: false,
    });
  };

  addPrediction(number) {
    console.log('Add Prediction called');
    console.log(number);
    const predictionArray = this.state.predictionArray

    if (!this.state.predictionArray.includes(number)) {
      // this.handleDialogOpen(players[0], number);

      predictionArray.push(number)

      this.setState({
        predictionArray: predictionArray,
      })

    } else {

      //unpredict part of button
      const indexx = predictionArray.indexOf(number)
      predictionArray.splice(indexx, 1)
      console.log(indexx)

      this.setState({

        predictionArray: predictionArray

      });
    }
  }


  render() {

    // First check if loggined
    if (this.state.loginId) {

      const predictionArray = this.state.predictionArray;

      // document.getElementById('submitBtn').disabled = false -----> write this in reachJS :p

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

      var submitButton = <button disabled>Submit</button>

      if (this.state.predictionArray.length >= 7) {
        submitButton = <button onClick = {this.handleDialogOpen} className = "btn btn-success">Submit</button>
      }


      return (
        <div id="prediction-gallery">
          <h2 className="center">Make your predictions</h2>
            { submitButton }
            <h6>This button will be enabled once you predict all 7 players. :)</h6>
          
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
