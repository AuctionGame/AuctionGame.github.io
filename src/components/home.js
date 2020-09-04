import React from 'react';
// import * as firebase from 'firebase';
import Predict from './predict';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SimplePlayerCard from './SimplePlayerCard';

import firebase from 'firebase/app';
import 'firebase/firestore';

function MiddleBlock(props) {
  if (props.currentMain) {
    // Team 1 to 8

    // This current has been changed to dictionary
    var current = props.teams[props.currentMain];

    var cardsElementList = [];
    // current.map((element, index) => {
    //   console.log(element);
    //   cardsElementList.push(<SimplePlayerCard value={element} />);
    //   return false;
    // });

    for (var key in current) {
      console.log('Creating middle block', key, current[key]);
      cardsElementList.push(
        <SimplePlayerCard key={key} value={key} price={current[key]} />,
      );
    }

    return <div className="row">{cardsElementList}</div>;
  } else {
    // Above Auction One

    if (props.currentMain === 'unsold') {
      return 'UNSOLD ONE';
    } else {
      // This is the curretn Auction status
      // return `Current Auction going for ${props.round} `;
      return <SimplePlayerCard colSize="6" highQuality={true} value={props.round} toShowBidPrice={true} />;
    }
  }
}

function LeftTabs(props) {
  var heading = 'Auction Status';

  if (props.value) {
    heading = props.teamName;
  }

  return (
    <ListItem button key={props.value} onClick={props.handler}>
      <ListItemText primary={heading} />
    </ListItem>
  );
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: {
        1: [12, 14],
        2: [15, 16, 19],
        3: [30, 10],
        4: [1],
        5: [2],
        6: [4],
        7: [5],
        8: [6, 7, 9],
      },
      currentMain: 0,
      teamNames: {
        1: "Team 1",
        2: "Team 2",
        3: "Team 3",
        4: "Team 4",
        5: "Team 5",
        6: "Team 6",
        7: "Team 7", 
        8: "Team 8"
      },
      moneyLeft: {
        1: 100,
        2: 200,
        3: 300,
        4: 400,
        5: 500,
        6: 600,
        7: 700, 
        8: 800
      },
    };
  }

  updateCurrrentMain(i) {
    console.log('update current main', i);
    this.setState({
      currentMain: i,
    });
  }

  componentDidMount() {
    const db = firebase.firestore();

    db.collection('team_players').onSnapshot((snap) => {
      var empty_dict = {};
      snap.forEach((doc) => {
        empty_dict[doc.id] = doc.data();
      });

      // Empty dict created with all the values
      this.setState({
        teams: empty_dict,
      });
    });

    db.collection('selectedTeams').get()
    .then((snap) => {
      
      let teamNamesDict = {}
      snap.forEach(doc => {
        teamNamesDict[doc.id] = doc.data()['teamName'];
      });

      this.setState({
        teamNames: teamNamesDict
      });
    }).catch(error => {
      console.log("Team Name Fetch failed");
    })
    
  }

  render() {
    const round = this.props.round;

    if (round === 'prediction') {
      return <Predict />;
    } else {
      // First creation of Left menu
      const leftBar = [];
      for (let i = 0; i <= 8; i++) {
        // For first one is the auction one
        leftBar.push(
          <LeftTabs
            key={i}
            value={i}
            handler={() => this.updateCurrrentMain(i)}
            teamName={this.state.teamNames[i]}
          />,
        );
      }

      const currentMain = this.state.currentMain;

      return (
        <div id="auction-container">
          <div className="row">
            <div className="col-sm-3">
              <List id="left-bar">{leftBar}</List>
            </div>
            <div className="col-sm-9">
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
