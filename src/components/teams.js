import React, { Fragment } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import '../css/teams.css';
import UnseletedTeams from "./unselectedTeams"
import TeamCard from "./teamCard.js"


class Teams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamDetails: {},
      predictionDict: {},
      toShowSelected : true,
    };
  }

  showSelected = () => {
    this.setState({
      toShowSelected : true,
    });
  }

  showUnselected = () => {
    this.setState({
      toShowSelected : false,
    });
  }

  componentDidMount() {
    // Here we will extract the data from firebase
    const db = firebase.firestore();

    db.collection('selectedTeams') //change this back to selected teams :p
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

      db.collection('predictions')
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
  }

  render() {

    if (this.state.toShowSelected) {
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

    for (let key in teamDetails) {
      allTeamsComponent.push(
        <TeamCard
          key={key}
          teamName={teamNames[key - 1]}
          teamMember={teamMembers[key - 1]}
          teamLeader={teamLeaders[key - 1]}
          teamCode={teamCodes[key - 1]}
          prediction_arr={predictionDict[teamCodes[key - 1]]}
        />,
      );
    }
    

    return (
      <Fragment>

        <div id="navbar" class="container-fluid">
          <div class="row">
            <div class="col center" onClick={this.showSelected}> Teams for Auction</div>
            <div class="col center" onClick={this.showUnselected}> Teams for IPO </div>
          </div>

        </div>

        <div className="container-fluid">{allTeamsComponent}</div>

      </Fragment>

    )
    }
    else {

      return(
        <Fragment>
        <div id="navbar" class="container-fluid">
          <div class="row">
            <div class="col center" onClick={this.showSelected}> Teams for Auction</div>
            <div class="col center" onClick={this.showUnselected}> Teams for IPO </div>
          </div>
        </div>

        <UnseletedTeams />
      </Fragment>
      )
    }
  }
}

export default Teams;
