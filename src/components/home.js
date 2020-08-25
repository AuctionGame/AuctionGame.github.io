import React from 'react';
// import * as firebase from 'firebase';
import Predict from './predict';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SimplePlayerCard from './SimplePlayerCard';

function MiddleBlock(props) {
  if(props.currentMain) {
    // Team 1 to 8

    var current = props.teams[props.currentMain];

    var cardsElementList = [];
    current.map((element, index) => {
      console.log(element);
      cardsElementList.push(
        <SimplePlayerCard value={element} />
      )
      return false;
    })
    

    return (
      <div className="row">
        {cardsElementList}
      </div>
    )
  } else {
    // Above Auction One
    return (
      `Current Auction going for ${props.round} `
    )
  }
}


function LeftTabs(props) {

  var heading="Auction Status";

  if(props.value) {
    heading = "Team " + props.value;
  }

  return (
    <ListItem button
      key={props.value}
      onClick={props.handler}
      >
      <ListItemText primary={heading} />
    </ListItem>
  )
}

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      teams: {
        1: [12,14],
        2: [15,16,19],
        3: [30,10],
        4: [1],
        5: [2],
        6: [4],
        7: [5],
        8: [6,7,9]
      },
      currentMain: 0
    }
  }

  updateCurrrentMain(i) {
    console.log("update current main", i);
    this.setState({
      currentMain: i
    })
  }


  render() {
    const round = this.props.round;

    if (round === 'prediction') {
      return <Predict />;
    } else {

      // First creation of Left menu
      const leftBar = [];
      for(let i=0; i<=8; i++) {
        // For first one is the auction one
        leftBar.push(
          <LeftTabs 
            key={i}
            value={i}
            handler={() => this.updateCurrrentMain(i)}
          />
        )
      }

      const currentMain = this.state.currentMain;

      return ( 
        <div id="auction-container">
          <div className="row">
            <div className="col-sm-3">
              <List id="left-bar">{leftBar}</List>
            </div>
            <div className="col-sm-6">
              <MiddleBlock 
                currentMain={currentMain}
                teams={this.state.teams}
                round={this.props.round}
              />
            </div>
          </div>
        </div> 
      );
    }
  }
}

export default Home;
