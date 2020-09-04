import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';


export default class QuizResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scorecard: {
                1: 40,
                2: 35,
                3: 10
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
                this.setState ({
                    scorecard: tempDict
                })
            }
        )

    }




    render() {
        const scorecard = this.state.scorecard
        const tableToCreate = []
        for (var key in scorecard) {
            tableToCreate.push(
                <tr>
                    <td>Team {key}</td>
                    <td>{scorecard[key]}</td>
                </tr>
            )
        }

        return (
            <div className="table">
                <table>
                    <tr>
                        <th>Team Name</th>
                        <th>Team Score</th>
                    </tr>
                    <tbody>
                        {tableToCreate}
                    </tbody>
                </table>
            </div>
        )

    }
}
