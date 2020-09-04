import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';


export default class QuizWaiting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: {},
      questions: {}
    }
  }

  componentDidMount() {
    const db = firebase.firestore();

    db.collection('questions').doc('answers').get()
    .then( (doc) => {
      // console.log(doc.data());
      this.setState({
        answers: doc.data()
      });
    })
    .catch(
    (error) => {
      console.log("Fetch correct answers failed!");
    });


    db.collection('questions').doc('questionSet').get()
    .then( (doc) => {
      // console.log(doc.data());
      this.setState({
        questions: doc.data()
      });
    })
    .catch(
    (error) => {
      console.log("Fetch correct questions failed!");
    });
  }

  render() {
    const correctAnswers = this.state.answers;
    const questions = this.state.questions;

    const answersComponent = [];
    for(var key in questions) {

      answersComponent.push(
        <div key={key} className="answers-block jumbotron">
          <p> {key} : {questions[key]} </p>
          <h4> Answer {key} : {correctAnswers[key]}</h4>
        </div>
      )
    }


    return (
      <div className="container">
        {answersComponent}
      </div>
    )
  }
  
}
