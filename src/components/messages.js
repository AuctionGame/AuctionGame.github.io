import React from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messagesArray: [],
    };
  }

  updateMessages(messagesArray) {
    this.setState({
      messagesArray: messagesArray,
    });
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('admin')
      .doc('updates')
      .onSnapshot(
        (snap) => {
          try {
            console.log('messages', snap.data());
            this.updateMessages(snap.data()['announcements']);
          } catch(error) {
            this.updateMessages(['Fetch Failed']);
          }
          
        },
        (error) => {
          console.log('Messages Error came', error);
        },
      );
  }

  render() {
    const messageEl = ['Latest First'];
    const messagesArray = this.state.messagesArray;
    for (let i = messagesArray.length - 1; i >= 0; i--) {
      messageEl.push(<li key={i}>{messagesArray[i]}</li>);
    }

    return (
      <div className="jumbotron updates-table" id="updates-container">
        <h1 className="center">Updates</h1>
        <ul style={{overflow: "auto", height:"40vh"}}>{messageEl}</ul>
      </div>
    );
  }
}

export default Messages;
