import React, {Fragment} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';



export default class QuizResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scorecard: {
               
            }
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
                this.setState ({
                    scorecard: items
                })
            }
        )

    }

    render() {
        const scorecard = this.state.scorecard
        const tableToCreate = []
        for (let i = 0;i<scorecard.length;i++){
            tableToCreate.push(
                <Fragment key = {i}>
                <tr>
                    <td>Team {scorecard[i][0]}</td>
                    <td>{scorecard[i][1]}</td>
                </tr>
                </Fragment>
            )
        }

        return (
            <div className="table">
                <table>
                    <thead>
                        <tr>
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
