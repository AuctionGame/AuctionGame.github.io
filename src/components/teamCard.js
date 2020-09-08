import React, { Fragment } from 'react';
import playerName from '../data/players.json';

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

  let title = 'Predicted Players';
  if (props.priority) {
    title = 'Chosen Players';

    try {
      for (let i = 0; i < props.prediction_arr.priorityArray.length; i++) {
        const imgSrc = 'cpng/' + props.prediction_arr.priorityArray[i] + '.jpg';

        predictionComponent.push(
          <div key={i} className="predictionList col-sm-1">
            <div class="card" style={{ width: '8rem', height: '95%' }}>
              <img
                src={imgSrc}
                class="card-img-top"
                alt={playerName[props.prediction_arr.priorityArray[i]]}
              />
              <div class="card-body">
                <p class="card-text">
                  {playerName[props.prediction_arr.priorityArray[i]]}
                </p>
              </div>
            </div>
          </div>,
        );
      }
    } catch (error) {
      console.log('sed life 2');
    }
  } else {
    try {
      for (let i = 0; i < props.prediction_arr.predictionArray.length; i++) {
        const imgSrc =
          'cpng/' + props.prediction_arr.predictionArray[i] + '.jpg';

        predictionComponent.push(
          <div key={i} className="predictionList col-sm-1">
            <div class="card" style={{ width: '8rem', height: '95%' }}>
              <img
                src={imgSrc}
                class="card-img-top"
                alt={playerName[props.prediction_arr.predictionArray[i]]}
              />
              <div class="card-body">
                <p class="card-text">
                  {playerName[props.prediction_arr.predictionArray[i]]}
                </p>
              </div>
            </div>
          </div>,
        );
      }
    } catch (error) {
      console.log('sed life 2');
    }
  }
  return (
    <Fragment>
      <h4 className="titleOfpredict">{title}</h4>
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

export default TeamCard;
