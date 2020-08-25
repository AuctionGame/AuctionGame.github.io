import React from 'react';
// import * as firebase from 'firebase';
import Predict from './predict';


function LeftTabs(props) {
  return (
    <h1>Auction </h1>
  )
}

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      teams: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: []
      }
    }
  }


  render() {
    const round = this.props.round;

    if (round === 'prediction') {
      return <Predict />;
    } else {
      return ( 
        <div id="auction-container">
          <div class="row">
            <div className="col-sm-3">
            
            </div>
            <div class="col-sm-6">
            Hello Main 
            </div>
          </div>
        </div> 
      );
    }
  }
}

export default Home;
