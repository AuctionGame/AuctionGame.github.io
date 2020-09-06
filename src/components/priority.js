import React, { Fragment } from 'react';

import bidprice from '../data/bidprice.json';
import MyCard from './card';
import players from '../data/players.json';

const allowedCount = {'1,00,000' : 2 , '3,00,000' : 3 , '5,00,000' : 2}

class Priority extends React.Component {
  constructor(props) {
    super(props);

    // Order is mandatory in priority List
    this.state = {
      priorityList: [],
      bidPriceDict: {
        "5,00,000": [],
        "3,00,000": [],
        "1,00,000": []
      }
    }
  }

  addPriority = (i) => {
    //console.log("Add this to priorty", i);

    const priorityList = this.state.priorityList;
    const bidPriceDict = this.state.bidPriceDict;
    const curCategory = bidprice[i];
    let curCount = 1;

    if (priorityList.includes(i)) { //This is for removing player from priority list
      const indexx = priorityList.indexOf(i);
      priorityList.splice(indexx, 1);
    } else { // This is for adding player to priority list
      for (var j = 0; j< priorityList.length ; j++){
        if(bidprice[priorityList[j]] == curCategory)
          curCount += 1;
      }
      if (curCount > allowedCount[curCategory]){
        alert("You have already selected " + allowedCount[curCategory] + " players of this category");
      }
      else{
        priorityList.push(i);
      }
    }
    //console.log(priorityList , curCategory , curCount)

    this.setState({
      priorityList: priorityList
    });
  }

  componentDidMount() {

    // First create the dictionary
    let bidPriceDict = {}
    for (var pno in bidprice) {
      if (bidPriceDict[bidprice[pno]]) {
        bidPriceDict[bidprice[pno]].push(pno);
      } else {
        bidPriceDict[bidprice[pno]] = [pno];
      }
    }

    // Here we store the bidPricedict for further uses
    this.setState({
      bidPriceDict: bidPriceDict
    });

  }

  render() {

    const priorityList = this.state.priorityList;
    const currentPriority = priorityList.length + 1;
    const bidPriceDict = this.state.bidPriceDict;
    
    const priorityListElements = priorityList.map(i => (
      <MyCard
        key={i}
        img={i}
        name={players[i]}
        type="Bowler"
        status = {this.state.priorityList.includes(i)}
        handler={() => this.addPriority(i)}
      />
    ))
    console.log("priority list elements " , priorityListElements.length)
    const priorityComponent = []

    let i = 1
    for (var key in bidPriceDict) {

      const playerArray = bidPriceDict[key];

      const elementArr = playerArray.map(i => (
        <MyCard
          key={i}
          img={i}
          name={players[i]}
          type="Bowler"
          status = {this.state.priorityList.includes(i)}
          handler={() => this.addPriority(i)}
        />
      ))
      

      priorityComponent.push(
      <h3>Category {i} (Maximum {allowedCount[key]} players)</h3>,
        <div className="row" >
          {elementArr}
        </div>
      )

      i++;
    }

    return (
      <Fragment>
        <h2>Choose your Priority {currentPriority}</h2>
        <div className = "container-fluid" style={{height:"80vh" , overflowY:"auto"}}>
          {priorityComponent}
          </div>
  
        <h3> Your priority list </h3>
        <div className="row">
          {priorityListElements}
        </div>
      </Fragment>
    )
  }
}

export default Priority;
