import React from 'react';
import SimplePlayerCard from './SimplePlayerCard';

function Player() {
  const elementArr = [];
  for (let i = 1; i <= 60; i++) {
    elementArr.push(<SimplePlayerCard key={i} value={i} />);
  }

  return (
    <div className="container">
      <div className="row">{elementArr}</div>
    </div>
  );
}

export default Player;
