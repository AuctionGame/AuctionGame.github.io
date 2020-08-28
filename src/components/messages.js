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
          console.log('messages', snap.data());
          this.updateMessages(snap.data()['announcements']);
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
      <div className="jumbotron" id="updates-container">
        <h1 className="center">Updates</h1>
        <ul>{messageEl}</ul>
      </div>
    );
  }
}

export default Messages;
