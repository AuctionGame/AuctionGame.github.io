import React, { Fragment } from 'react';

import bidprice from '../data/bidprice.json';
import MyCard from './card';
import players from '../data/players.json';

import firebase from 'firebase/app';
import 'firebase/firestore';


import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const allowedCount = { '1,00,000': 2, '3,00,000': 3, '5,00,000': 2 }

class Priority extends React.Component {
  constructor(props) {
    super(props);

    // Order is mandatory in priority List
    this.state = {
      priorityList: [],
      bidPriceDict: {
        "5,00,000": [],
        "3,00,000": [],
        "1,00,000": []
      },
      open: false
    }
  }

  handleDialogClose = () => {
    this.setState({
      open: false
    });
  }

  addPriority = (i) => {
    //console.log("Add this to priorty", i);

    const priorityList = this.state.priorityList;
    const curCategory = bidprice[i];
    let curCount = 1;

    if (priorityList.includes(i)) { //This is for removing player from priority list
      const indexx = priorityList.indexOf(i);
      priorityList.splice(indexx, 1);
    } else { // This is for adding player to priority list
      for (var j = 0; j < priorityList.length; j++) {
        if (bidprice[priorityList[j]] === curCategory)
          curCount += 1;
      }
      if (curCount > allowedCount[curCategory]) {
        alert("You have already selected " + allowedCount[curCategory] + " players of this category");
      }
      else {
        priorityList.push(i);
      }
    }
    //console.log(priorityList , curCategory , curCount)

    this.setState({
      priorityList: priorityList
    });
  }

  submitPriorities = () => {
    console.log("Submititing priorites to", this.props.loginId);
    const db = firebase.firestore();

    const priorityList = this.state.priorityList;

    let intArr = []
    for ( let i=0; i<priorityList.length; i++) {
      intArr.push(parseInt(priorityList[i]));
    }

    db.collection('priority').doc(this.props.loginId).set({
      priorityArray: intArr
    });

    this.setState({
      open: true
    });
  }

  componentDidMount() {

    // First create the dictionary
    let bidPriceDict = {}
    for (var pno in bidprice) {
      if (bidPriceDict[bidprice[pno]]) {
        bidPriceDict[bidprice[pno]].push(pno);
      } else {
        bidPriceDict[bidprice[pno]] = [pno];
      }
    }

    // Added realtime updated
    const db = firebase.firestore();
    db.collection('priority').doc(this.props.loginId)
    .onSnapshot((snap) => {

      const tempArr = snap.data()['priorityArray'];

      // Converting it to string 
      var strArray = [];
      for(let i=0; i < tempArr.length; i++) {
        strArray.push(tempArr[i] + "")
      }

      this.setState({
        priorityList: strArray
      });
    }, (error) => {
      console.log("Fetch failed in priority fetch");
    })

    // Here we store the bidPricedict for further uses
    this.setState({
      bidPriceDict: bidPriceDict
    });

  }

  render() {

    const priorityList = this.state.priorityList;
    const currentPriority = priorityList.length + 1;
    const bidPriceDict = this.state.bidPriceDict;

    const priorityListElements = priorityList.map(i => (
      <MyCard
        key={i}
        img={i}
        name={players[i]}
        type="Bowler"
        status={this.state.priorityList.includes(i)}
        handler={() => this.addPriority(i)}
      />
    ))
    console.log("priority list elements ", priorityListElements.length)
    const priorityComponent = []

    let i = 1
    for (var key in bidPriceDict) {

      const playerArray = bidPriceDict[key];

      const elementArr = playerArray.map(i => (
        <MyCard
          key={i}
          img={i}
          name={players[i]}
          type="Bowler"
          status={this.state.priorityList.includes(i)}
          handler={() => this.addPriority(i)}
        />
      ))


      priorityComponent.push(
        <h3>Category {i} (Maximum {allowedCount[key]} players)</h3>,
        <div className="row" >
          {elementArr}
        </div>
      )

      i++;
    }

    let submitButton = <button className="btn btn-info" style={{ marginLeft: "auto" }} disabled>Submit</button>;
    if (priorityList.length >=7) {
      submitButton = <button className="btn btn-success" onClick={this.submitPriorities} style={{ marginLeft: "auto" }}>Submit</button>
    }


    return (
      <Fragment>
        <div style={{ display: "flex" }}>
          <h2>Choose your Priority {currentPriority}</h2>
          {submitButton}
        </div>

        <div className="container-fluid" style={{ height: "80vh", overflowY: "auto" }}>
          {priorityComponent}
        </div>

        <h3> Your priority list </h3>
        <div className="row">
          {priorityListElements}
        </div>

        <Dialog
              open={this.state.open}
              onClose={this.handleDialogClose}
              aria-labelledby="Login Failed"
              aria-describedby="Fail dialog"
            >
              <DialogTitle id="alert-dialog-title">
                Submited
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You choices have been updated, you can still make changes
              </DialogContentText>
              </DialogContent>
            </Dialog>
        
      </Fragment>
    )
  }
}

export default Priority;
