import React, { Fragment } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';



export default class QuizResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scorecard: {},
            teamNames: {
                1: "Team 1",
                2: "Team 2",
                3: "Team 3",
                4: "Team 4",
                5: "Team 5",
                6: "Team 6",
                7: "Team 7",
                8: "Team 8"
            },
        }
    }

    componentDidMount() {
        const db = firebase.firestore()

        db.collection("scorecard").onSnapshot(
            (snap) => {
                let tempDict = {}
                snap.forEach(
                    (doc) => {
                        tempDict[doc.id] = doc.data().total
                    }
                )
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
            }
        )

        db.collection("registeredTeams").get()
        .then((doc) => {

            let teamNames = {}
            doc.forEach(row => {
                teamNames[row.id] = row.data()['teamName'];
            });

            this.setState({
                teamNames: teamNames
            });
        })
        .catch((error) => {
            console.log("Error in quiz Result", error);
        });


    }

    render() {
        const scorecard = this.state.scorecard
        const tableToCreate = []
        for (let i = 0; i < scorecard.length; i++) {
            tableToCreate.push(
                <Fragment key={i}>
                    <tr class="table-info" style={{textAlign: "center"}}>
                        <td>{i+1}</td>
                        <td>{this.state.teamNames[scorecard[i][0]]}</td>
                        <td>{scorecard[i][1]}</td>
                    </tr>
                </Fragment>
            )
        }

        return (
            <div className="table" style={{padding: "60px"}}>
                <p><h1 style={{textAlign: "center"}}>Quiz Results!</h1></p>
                <table  style={{margin: "auto", width: "70%", border: '1px solid black', borderRadius: '100px!important'}}>
                    <thead class="thead-dark">
                        <tr style={{textAlign: "center"}}>
                            <th>Rank</th>
                            <th>Team Name</th>
                            <th>Team Score</th>
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
