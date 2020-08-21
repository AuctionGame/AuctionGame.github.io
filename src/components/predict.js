import React from 'react';
import Card from './card';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Predict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      predictionArray: [],
      open: false,
      dialogName: 'Confirm',
      confirmNumber: 0,
    };
  }

  // Add all the names here TO BE DONE
  players = ['MSD'];

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
    const newArr = this.state.predictionArray;
    const number = this.state.confirmNumber;

    if (!newArr.includes(number)) {
      newArr.push(number);
    }

    // Update the firebase with this data
    // Finally update the current state of this class
    this.setState({
      predictionArray: newArr,
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

  render() {
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
  }
}

export default Predict;
