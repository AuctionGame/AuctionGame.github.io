import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

function TeamCard(props) {
  const teamMember = props.teamMember;
  const teamMemberComponent = [];

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

  return (
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="teamNames">Team Name - {props.teamName}</h5>
        <h6 className="teamLeaders mb-2 text-muted">
          {' '}
          Team Leader - {props.teamLeader}
        </h6>
        <p className="teamMembers"> Members - {teamMemberComponent}</p>
      </div>
    </div>
  );
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

    db.collection('registeredTeams') //change this back to selected teams :p
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
  }

  render() {
    const teamDetails = this.state.teamDetails;

    const teamNames = [];
    const teamMembers = [];
    const teamLeaders = [];
    const allTeamsComponent = [];

    for (let key in teamDetails) {
      teamNames.push(teamDetails[key]['teamName']);
      teamMembers.push(teamDetails[key]['teamMembers']);
      teamLeaders.push(teamDetails[key]['teamLeader']);
    }

    for (let key in teamDetails) {
      allTeamsComponent.push(
        <TeamCard
          key={key}
          teamName={teamNames[key - 1]}
          teamMember={teamMembers[key - 1]}
          teamLeader={teamLeaders[key - 1]}
        />,
      );
    }

    return <div className="container">{allTeamsComponent}</div>;
  }
}

export default Teams;
