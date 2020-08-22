import React from 'react';
import Input from '@material-ui/core/Input';
import firebase from 'firebase/app';
import 'firebase/firestore';

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 'RPtYx30BJ0EuTzPuMQhI',
      currentQuestionNumber: 1,
      currentQuestion: '',
      answer: '',
      questions: {},
      answerDict : {1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:"",9:"",10:""},
    };
    this.updateQuestion = this.updateQuestion.bind(this);
    this.handleAnswerInput = this.handleAnswerInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateQuestion(value) {
    this.setState({
      currentQuestion: value,
    });
  }

  handleAnswerInput(event) {
    this.setState({ answer: event.target.value });
  }

  handleSubmit(event) {
    var answer = this.state.answer;
    var Qno = this.state.currentQuestionNumber;
    event.preventDefault();

    var tempDict = {};
    tempDict[Qno] = answer;

    const db = firebase.firestore();
    db.collection('answers')
      .doc(this.state.userID)
      .set(tempDict, { merge: true });
    
    var newQno = this.state.currentQuestionNumber + 1;  
    this.setState({
      answer: '',
      currentQuestionNumber : newQno,
      currentQuestion : this.state.questions[newQno]

    })
  }


  //for toggling between questions using tabs

  questionTab(i) {
    this.setState({
        currentQuestion :  this.state.questions[i],
        currentQuestionNumber : i,
  })
}



  componentDidMount() {
    const db = firebase.firestore();
    const doc = db.collection('questions').doc('questionSet');

    doc
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data());
          console.log(this.state.currentQuestion);

          this.setState({
            currentQuestion: doc.data()[this.state.currentQuestionNumber],
            questions: doc.data(),
          });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });

      db.collection('answers').doc(this.state.userID).onSnapshot(
        (snap) => {
          this.setState({
            answerDict : snap.data()
          })
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        },
      );



  }

  render() {

//  for the questions tabs 
    const tabs = () => {
      var total = [1,2,3,4,5,6,7,8,9,10]
      return total.map((i) => { 
        var colorType = "btn-success";
        if (!this.state.answerDict[i]) {
          colorType = "btn-warning";
        }
        return <button onClick={()=> this.questionTab(i)} className={`btn tabs ${colorType}`} >{i}</button>
      });
    };


    return (
      <div>
      <div id="quiz-box" className="container">
        <div className="jumbotron">
          <h3 className="display-4">
            Question {this.state.currentQuestionNumber}
          </h3>
          <p className="lead">{this.state.currentQuestion}</p>
          <hr className="my-4" />
          <form onSubmit={this.handleSubmit}>
            <p>
              <Input
                onChange={this.handleAnswerInput}
                value={this.state.answer}
                placeholder = {this.state.answerDict[this.state.currentQuestionNumber]}
              ></Input>
            </p>
            <p className="lead">
              <button type="Submit" className="btn btn-primary">
                Submit
              </button>
            </p>
          </form>
        </div>
      </div>

        <div id="questions-tab" className="container">     
            {tabs()}
        </div>
      </div>

    );
  }
}


export default Quiz;
