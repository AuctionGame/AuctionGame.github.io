import React, { Fragment } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import SimplePlayerCard from "./SimplePlayerCard"
import "../css/teams.css"
import playerName from "../data/players.json"

function TeamCard(props) {
  const teamMember = props.teamMember;
  const teamMemberComponent = [];
  const predictionComponent = [];

  try {
    for (let i = 0; i < teamMember.length; i++) {
      teamMemberComponent.push(
        <li key={i} className="teamMemberList">
          {teamMember[i]}
        </li>,
      );
    }
  } catch (error) {
    console.log('sed life');
  }


  try {
    for (let i = 0; i < props.prediction_arr.predictionArray.length; i++) {

      const imgSrc = 'cpng/' + props.prediction_arr.predictionArray[i] + '.jpg'

      predictionComponent.push(

        <div key={i} className="predictionList col-sm-1">
          
          <div class="card" style={{ width: "8rem", height: "95%" }}>
            <img src={imgSrc} class="card-img-top" />
            <div class="card-body">
              <p class="card-text">{playerName[props.prediction_arr.predictionArray[i]]}</p>
            </div>
          </div>
          
        </div>,
      );
    }
  } catch (error) {
    console.log('sed life 2');
  }

  return (
    <Fragment>
      <h4 className = "titleOfpredict">Predicted Players</h4>
      <div className="row">
        <div className="col-sm-3">
            <div className="card" style={{ width: '90%' }}>
              <div className="card-body">
                <h5 className="teamNames">Team Name - {props.teamName}</h5>
                <h6 className="teamLeaders mb-2 text-muted">
                  {' '}
                  Team Leader - {props.teamLeader}
                </h6>
                <p className="teamMembers"> Members - {teamMemberComponent}</p>
              </div>
            </div>
        </div>
      

          {predictionComponent}
          
      </div>  



    </Fragment>



  );
}
class Teams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamDetails: {},
      predictionDict : {},
    };
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

      console.log(this.props.round)

      if (this.props.round !== "prediction"){

        console.log("if is working")

        var predictionArray = {}

          db.collection("predictions").get().then(snap => {

            snap.forEach(doc => {

              predictionArray[doc.id] = doc.data()

            });

          this.setState({

            predictionDict : predictionArray

          }) 

          console.log(this.state.predictionDict)

          })



          
      } else{

        console.log("prediction is going on")
      }
  }

  render() {
    const teamDetails = this.state.teamDetails;

    const teamCodes = []
    const teamNames = [];
    const teamMembers = [];
    const teamLeaders = [];
    const allTeamsComponent = [];
    const predictionComponent = [];
    const predictionDict = this.state.predictionDict;

    for (let key in teamDetails) {
      teamNames.push(teamDetails[key]['teamName']);
      teamMembers.push(teamDetails[key]['teamMembers']);
      teamLeaders.push(teamDetails[key]['teamLeader']);
      teamCodes.push(teamDetails[key]['teamCode'])
    }

    for (let key in teamDetails) {
      allTeamsComponent.push(
        <TeamCard
          key={key}
          teamName={teamNames[key - 1]}
          teamMember={teamMembers[key - 1]}
          teamLeader={teamLeaders[key - 1]}
          teamCode ={teamCodes[key-1]}
          prediction_arr = {predictionDict[teamCodes[key-1]]}
        />,
      );
    }




    return <div className="container-fluid">{allTeamsComponent}</div>;
  }
}

export default Teams;
