import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { render } from '@testing-library/react';

function TeamCard(props) {
  const teamMember = props.teamMember
  const teamMemberComponent = []

  try {
    for (let i=0; i<4; i++) {
      teamMemberComponent.push(<li class="teamMemberList">{teamMember[i]}</li>)
    }
  }catch(error){
    console.log("sad life")
  }


  return (
    <div className="card" style={{width: "18rem"}}>
      <div className="card-body">
        <h5 className="teamNames">Team Name - {props.teamName}</h5>
        <h6 className="teamLeaders mb-2 text-muted"> Team Leader - {props.teamLeader}</h6>
        <p className="teamMembers"> Members - {teamMemberComponent}</p>
      </div>
    </div>
  )
}
class Teams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamDetails: {},
    };
  }

  componentDidMount() {
    // Here we will extract the data from firebase
    const db = firebase.firestore();

    db.collection('selectedTeams')
      .onSnapshot(
        (snap) => {
          var Dict = {}
          snap.forEach(doc => {
            const data = doc.data();
            Dict[doc.id] = data
          });

          this.setState({
            teamDetails: Dict
          });
        },
        (err) => {
          console.log('Fetch Failed');
        },
      );
  }

  render() {
    const teamDetails = this.state.teamDetails;

    const teamNames = [];
    const teamMembers = [];
    const teamLeaders = [];
    const allTeamsComponent = [];

    for (var key in teamDetails) {
      teamNames.push(teamDetails[key]["teamName"]);
      teamMembers.push(teamDetails[key]["teamMembers"]);
      teamLeaders.push(teamDetails[key]["teamLeader"]);      
    }

    for (let i=0 ; i<2 ; i++) {

      allTeamsComponent.push(<TeamCard teamName={teamNames[i]} teamMember={teamMembers[i]} teamLeader={teamLeaders[i]} />)

    }





    return (

      <div className="container">

        {allTeamsComponent}



      </div>
    );
  }
}



export default Teams;
