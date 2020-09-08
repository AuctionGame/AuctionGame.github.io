import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import '../css/teams.css';
import TeamCard from './teamCard.js';

export default class UnselectedTeams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamDetails: {},
      predictionDict: {},
      sharesDict : {},
    };
  }

  componentDidMount() {
    // Here we will extract the data from firebase
    const db = firebase.firestore();

    db.collection('unselectedTeams') //change this back to selected teams :p
      .onSnapshot(
        (snap) => {
          var Dict = {};
          snap.forEach((doc) => {
            const data = doc.data();
            Dict[doc.id] = data;
          });

          this.setState({
            teamDetails: Dict,
          });
        },
        (err) => {
          console.log('Fetch Failed');
        },
      );

    console.log(this.props.round);

    if (this.props.round !== 'prediction') {
      console.log('if is working');

      var predictionArray = {};

      db.collection('priority')
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            predictionArray[doc.id] = doc.data();
          });

          this.setState({
            predictionDict: predictionArray,
          });

          console.log(this.state.predictionDict);
        });
    } else {
      console.log('prediction is going on');
    }
    const sharesDict = {};
    db.collection("priorityPlayers").get().then((snap) => {
      snap.forEach((doc) => {
        var playerNo = doc.id;
        var teamOwners = doc.data()["teams"];
        var percentShare = Math.floor(100/teamOwners.length);
        for(var i = 0; i<teamOwners.length; i++){
          if(!sharesDict[teamOwners[i]]){
            sharesDict[teamOwners[i]] = {};
          }
          sharesDict[teamOwners[i]][playerNo] = percentShare;
        }
      })
      console.log("Shares Dict" , sharesDict)
      this.setState({
        sharesDict:sharesDict,
      })
    })
  }

  render() {
    const teamDetails = this.state.teamDetails;

    const teamCodes = [];
    const teamNames = [];
    const teamMembers = [];
    const teamLeaders = [];
    const allTeamsComponent = [];
    const predictionDict = this.state.predictionDict;

    for (let key in teamDetails) {
      teamNames.push(teamDetails[key]['teamName']);
      teamMembers.push(teamDetails[key]['teamMembers']);
      teamLeaders.push(teamDetails[key]['teamLeader']);
      teamCodes.push(teamDetails[key]['teamCode']);
    }

    //sharedDict = teamCode : player : share

    for (let key = 1; key < teamCodes.length + 1; key++) {
      console.log("Sending data of team" , teamCodes[key-1])
      allTeamsComponent.push(
        <TeamCard
          key={key}
          teamName={teamNames[key - 1]}
          teamMember={teamMembers[key - 1]}
          teamLeader={teamLeaders[key - 1]}
          teamCode={teamCodes[key - 1]}
          prediction_arr={predictionDict[teamCodes[key - 1]]}
          priority={true}
          shares = {this.state.sharesDict[teamCodes[key-1]]}
        />,
      );
    }

    return <div className="container-fluid">{allTeamsComponent}</div>;
  }
}
