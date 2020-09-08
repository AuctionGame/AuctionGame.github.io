import React, { Fragment } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';


export default class PriorityResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scorecard: []
    }
  }

  componentDidMount() {
    const db = firebase.firestore()
    console.log('DB initialised')
    let tempDict = {}
    db.collection("unselectedTeams").onSnapshot(
      (snap) => {

        snap.forEach(
          (doc) => {
            tempDict[doc.data()['teamName']] = doc.data()['money']
          }
        )
        
        // Sorting by key and creating an array
        var items = Object.keys(tempDict).map(function (key) {
          return [key, tempDict[key]];
        });

        // Sort the array based on the second element
        items.sort(function (first, second) {
          return second[1] - first[1];
        });

        this.setState({
          scorecard: items
        })

      });

  }


  render() {
    const scorecard = this.state.scorecard;
    const tableToCreate = [];

    for (let key in scorecard) {
      tableToCreate.push(
        <Fragment key={key}>
          <tr className="table-info" style={{ textAlign: "center" }}>
            <td>{scorecard[key][0]}</td>
            <td>{scorecard[key][1]}</td>
          </tr>
        </Fragment>
      )
    }

    return (
      <div className="table" style={{ padding: "60px" }}>
        <h1 style={{ textAlign: "center" }}>IPO Leaderboard</h1>
        <table style={{ margin: "auto", width: "70%", border: '1px solid black', borderRadius: '5px!important' }}>
          <thead className="thead-dark">
            <tr style={{ textAlign: "center" }}>
              <th>Team Name</th>
              <th>Money</th>
            </tr>
          </thead>
          <tbody>
            {tableToCreate}
          </tbody>
        </table>
      </div>
    )

  }
}

