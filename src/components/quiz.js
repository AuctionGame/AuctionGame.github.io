import React from 'react';
import Input from '@material-ui/core/Input';
import firebase from 'firebase/app';
import 'firebase/firestore';

import LoginHandler from './LoginHandler';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class Quiz extends React.Component {
  constructor(props) {
    super(props);

    // sTVm5NerQMaqUnWWxQoN

    this.state = {
      userID: '',
      currentQuestionNumber: 1,
      currentQuestion: '',
      answer: '',
      questions: {},
      maxMarksPerQuestion: {},
      answerDict: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
      },
      loginFail: false,
    };
    this.updateQuestion = this.updateQuestion.bind(this);
    this.handleAnswerInput = this.handleAnswerInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginSubmitHandler = this.loginSubmitHandler.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleDialogClose() {
    this.setState({
      loginFail: false,
    });
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

    if (newQno > 10) {
      newQno = 1;
    }

    this.setState({
      answer: '',
      currentQuestionNumber: newQno,
      currentQuestion: this.state.questions[newQno],
    });
  }

  //for toggling between questions using tabs

  questionTab(i) {
    this.setState({
      currentQuestion: this.state.questions[i],
      currentQuestionNumber: i,
    });
  }

  loginSubmitHandler(val) {
    console.log('Submit Hanlder called', val);

    const db = firebase.firestore();
    const answersRef = db.collection('answers').doc(val);

    answersRef
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          // Doc exists so login successful

          // Now update the state
          this.setState({
            userID: val,
          });

          answersRef.onSnapshot(
            (snap) => {
              this.setState({
                answerDict: snap.data(),
              });
            },
            (err) => {
              console.log(`Encountered error: ${err}`);
            },
          );
        } else {
          this.setState({
            loginFail: true,
          });
        }
      })
      .catch(function (err) {
        alert('Network connection Error');
      }); // End of answersRef get
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
      .catch((error) => {
        console.log('Error getting document:', error);
      });

    // Here we will also fetch the marks
    db.collection('questions')
      .doc('marks')
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log('Marks', doc.data());
          this.setState({
            maxMarksPerQuestion: doc.data(),
          });
        } else {
          console.log('No such doc exists');
        }
      })
      .catch((error) => {
        console.log('Question marks fetch error', error);
      });
  } // End of componentDidMount

  render() {
    // First chck if the ID is entered on not

    if (this.state.userID) {
      //  for the questions tabs
      const tabs = () => {
        var total = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return total.map((i) => {
          var colorType = 'btn-success';
          if (!this.state.answerDict[i]) {
            colorType = 'btn-warning';
          }
          return (
            <button
              key={i}
              onClick={() => this.questionTab(i)}
              className={`btn tabs ${colorType}`}
            >
              {i}
            </button>
          );
        });
      };

      const marksOfThisQuestion = this.state.maxMarksPerQuestion[
        this.state.currentQuestionNumber
      ];

      return (
        <div>
          <h1 className="center">Quiz Round</h1>
          <div id="quiz-box" className="container">
            <div className="jumbotron">
              <h3 className="display-4">
                Question {this.state.currentQuestionNumber}
              </h3>
              <p className="lead">
                {this.state.currentQuestion} [{marksOfThisQuestion}]
              </p>
              <hr className="my-4" />
              <form onSubmit={this.handleSubmit}>
                <div className="input-gap">
                  <Input
                    onChange={this.handleAnswerInput}
                    value={this.state.answer}
                    placeholder={
                      this.state.answerDict[this.state.currentQuestionNumber]
                    }
                  ></Input>
                </div>
                <div className="lead">
                  <button type="Submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div id="questions-tab" className="container">
            {tabs()}
          </div>
        </div>
      );
    } // End of userId If
    else {
      return (
        <div id="quiz-login">
          <h1 className="center">Quiz Round</h1>
          <LoginHandler submitHandler={this.loginSubmitHandler} />

          <Dialog
            open={this.state.loginFail}
            onClose={this.handleDialogClose}
            aria-labelledby="Login Failed"
            aria-describedby="Fail dialog"
          >
            <DialogTitle id="alert-dialog-title">
              Login Unsuccessful
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please check you secret Id and try again!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose} color="primary">
                close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }
}

export default Quiz;
