import React, { Fragment } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';



export default class PriorityResults extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scorecard:{}
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
            });

        this.setState({
            scorecard: tempDict
        })

    }


    render() {
        const scorecard = this.state.scorecard
        const tableToCreate = []
        for (let key in scorecard) {
            tableToCreate.push(
                <Fragment>
                    <tr class="table-info" style={{ textAlign: "center" }}>
                        <td>{key}</td>
                        <td>{scorecard[key]}</td>
                    </tr>
                </Fragment>

            )
        }
        return (
            <div className="table" style={{ padding: "60px" }}>
                <h1 style={{ textAlign: "center" }}>IPO Round Table</h1>
                <table style={{ margin: "auto", width: "70%", border: '1px solid black', borderRadius: '5px!important' }}>
                    <thead class="thead-dark">
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

