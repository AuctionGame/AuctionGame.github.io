import React, { Fragment } from 'react';
// import * as firebase from 'firebase';
import Predict from './predict';
import "../css/home.css"

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

    return (
      <Fragment>
        <h5 className="center" style={{ margin: "12px" }}>Money left with this team : {props.moneyLeft} </h5>
        <div className="row">{cardsElementList}</div>
      </Fragment>

    )
  } else {
    // Above Auction One

    if (props.currentMain === 'unsold') {
      return 'UNSOLD ONE';
    } else {
      // This is the curretn Auction status
      // return `Current Auction going for ${props.round} `;

      const predictedByList = [];
      try {

        props.predictedByList.forEach(data => {
          predictedByList.push(
            <li style={{ marginLeft: "24px" }}>{data}</li>
          )
        });
      } catch(err) {
        // Here error will come when it is prediccted by none
        // i.e predictedByList is empty
        predictedByList.push(<p className="center"> No Team</p>)
      }

      return (
        <div className="row">
          <SimplePlayerCard colSize="4" highQuality={true} value={props.round} toShowBidPrice={true} fixedHeight={true} />

          <div className="col-sm-8">
            
            <div id="player-stats" className="jumbotron" style={{ margin: "22px", padding: "10px"}}>
              <table className="table">
                <thead>
                  <tr>
                    <td></td>
                    <td style={{ fontWeight : "bold"}}>2019</td>
                    <td style={{ fontWeight : "bold"}}>2018</td>
                    <td style={{ fontWeight : "bold"}}>2017</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight : "bold"}}>Matches</td>
                    <td>15</td>
                    <td>16</td>
                    <td>16</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight : "bold"}}>Runs</td>
                    <td>416</td>
                    <td>455</td>
                    <td>290</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight : "bold"}}>Average</td>
                    <td>83.20</td>
                    <td>75.83</td>
                    <td>26.63</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight : "bold"}}>Strike Rate</td>
                    <td>135.38</td>
                    <td>150.66</td>
                    <td>116.00</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight : "bold"}}>Catches</td>
                    <td>11</td>
                    <td>11</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight : "bold"}}>Stumpins</td>
                    <td>5</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
            <div id="predicted-by-list" class = "jumbotron prediction" style={{ margin: "12px", height: "320px"}}>
              <h3 className="center">Predicted by</h3>
              
                {predictedByList}
              
            </div>
        
        </div>
      )
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
      teamCodes: {
        1: "asdfgh",
        2: "hgfdsa"
      },
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
      predictionDict: {
        1: [],
        2: [],
        3: []
      }
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

    // Snapshot for players sold
    db.collection('team_players')
      .onSnapshot((snap) => {
        var empty_dict = {};
        snap.forEach((doc) => {
          empty_dict[doc.id] = doc.data();
        });

        // Empty dict created with all the values
        this.setState({
          teams: empty_dict,
        });
      });

    // A simple fetch for team names
    db.collection('selectedTeams').get()
      .then((snap) => {

        let teamNamesDict = {}
        let teamCodesDict = {}
        snap.forEach(doc => {
          teamNamesDict[doc.id] = doc.data()['teamName'];
          teamCodesDict[doc.data()['teamCode']] = doc.id
        });

        this.setState({
          teamNames: teamNamesDict,
          teamCodes: teamCodesDict
        });

        // predictions list to be extracted from firebase
        db.collection('predictions').get()
          .then((snap) => {
            let predictedTeams = {}

            snap.forEach(doc => {

              const predictionArray = doc.data()['predictionArray']
              for (let i = 0; i < predictionArray.length; i++) {
                if (predictedTeams[predictionArray[i]]) {
                  predictedTeams[predictionArray[i]].push(teamNamesDict[teamCodesDict[doc.id]])
                }
                else {
                  predictedTeams[predictionArray[i]] = [teamNamesDict[teamCodesDict[doc.id]]]
                }
              }

            });

            this.setState({
              predictionDict: predictedTeams
            });

          }).catch(error => {
            console.log("Team Name Fetch failed");
          });

      }).catch(error => {
        console.log("Team Name Fetch failed");
      });


    // A snapshot for money left
    db.collection('selectedTeams')
      .onSnapshot((snap) => {

        let moneyLeftDict = {};
        snap.forEach((doc) => {
          moneyLeftDict[doc.id] = doc.data()['money'];
        });

        this.setState({
          moneyLeft: moneyLeftDict
        });

        console.log(this.state.moneyLeft)

      }, (error) => {
        console.log("Money left snapshot failed", error);
      });

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
                moneyLeft={this.state.moneyLeft[currentMain]}
                currentMain={currentMain}
                teams={this.state.teams}
                round={this.props.round}
                predictedByList={this.state.predictionDict[this.props.round]}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Home;
