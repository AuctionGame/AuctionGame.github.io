import React, { useEffect } from 'react';
import SimplePlayerCard from './SimplePlayerCard';

import firebase from 'firebase/app';
import 'firebase/firestore';

class Player extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unsoldArray: []
    }
  }

  componentDidMount() {
    // Here we will extract the data from firebase
    const db = firebase.firestore();

    db.collection('team_players').doc('unsold')
    .onSnapshot((doc) => {
      
      var unsold_array = doc.data()['playerArray'];

      // Now store the data
      this.setState({
        unsoldArray : unsold_array
      });


    }, (err) => {
      console.log("Fetch Failed");
    })
  }

  render () {
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
 


  
}

export default Player;
