import React, { useEffect } from 'react';
import SimplePlayerCard from './SimplePlayerCard';

import firebase from 'firebase/app';
import 'firebase/firestore';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soldDict: {},
    };
  }

  componentDidMount() {
    // Here we will extract the data from firebase
    const db = firebase.firestore();

    db.collection('team_players')
      .onSnapshot(
        (snap) => {
          var soldDict = {}
          snap.forEach(doc => {
            const data = doc.data();
            for(var key in data) {
              soldDict[key] = data[key]
            }
          });

          // Finally update the ones who are sold 
          this.setState({
            soldDict : soldDict
          });
        },
        (err) => {
          console.log('Fetch Failed');
        },
      );
  }

  render() {
    const soldDict = this.state.soldDict;

    const elementArr = [];
    for (let i = 1; i <= 60; i++) {
      elementArr.push(<SimplePlayerCard key={i} value={i} sold={true} price={soldDict[i]} />);
    }

    return (
      <div className="container">
        <div className="row">{elementArr}</div>
      </div>
    );
  }
}

export default Player;
