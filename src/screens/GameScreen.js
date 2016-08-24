import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';
import * as actionTypes from '../store/game/actionTypes';
import * as actions from '../store/game/actions';
import _ from 'lodash';
// import autobind from 'react-autobind';


class GameScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    // autobind(this);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'menu') {
        this.props.dispatch(actions.stopGame(this.props.navigator));
      }
    }
  }

  renderLoadingPostsScreen() {
    return (
      <View style={styles.loadingContainer}>
        {this.props.points > 0 ? <Text>Good Job!</Text> : <View></View>}
        <Text>Loading a new post...</Text>
      </View>
    );
  }

  renderErrorScreen() {
    return (
      <View style={styles.errorContainer}>
        <Text>There was a terrible error...</Text>
        <TouchableOpacity onPress={() => {
          this.props.dispatch(actions.fetchNewPost());
        }}><Text style={{color: 'white'}}>Reload post</Text></TouchableOpacity>
      </View>
    );
  }

  renderGameOverScreen() {
    return (
      <View style={styles.gameOverContainer}>
        <Text>Game Over!</Text>
        <Text>You achived {this.props.points} points</Text>
        <TouchableOpacity onPress={() => {
          this.props.dispatch({type: actionTypes.START_GAME});
          this.props.dispatch(actions.fetchNewPost())
        }}><Text stype={styles.playAgainText}>Play again!</Text></TouchableOpacity>
      </View>
    );
  }

  answerPressed(comment, renderedComments) {
    // Check if the comment is the 1st comment
    if (comment == renderedComments[0]) {
      this.props.dispatch({type: actionTypes.RIGHT_ANSWER});
      this.props.dispatch(actions.fetchNewPost());
    }
    else {
      this.props.dispatch({type: actionTypes.WRONG_ANSWER});
    }
  }

  renderAnswers() {
    const toRender = [];
    for (let i=0; i < 4; i++) {
      const comment = this.props.post.comments[i].data;
      toRender.push(comment);
    }

    return (
      _.map(_.shuffle(toRender), (comment) => {
        return (
          <TouchableOpacity key={comment.id} onPress={() => this.answerPressed.bind(this)(comment, toRender)}>
            <View style={styles.answerContainer}>
              <Text>{comment.body}</Text>
            </View>
          </TouchableOpacity>
        );
      })
    );
  }

  renderPostScreen() {
    return (
      <ScrollView>
        <Text>Points: {this.props.points}</Text>
        <View style={styles.post}>
          <Text style={styles.subredditText}>Subreddit: {this.props.post.data.subreddit}</Text>
          <Text style={styles.titleText}>{this.props.post.data.title}</Text>
          <Text style={styles.contentText}>{this.props.post.data.selftext}</Text>
          <Text style={styles.instructionText}>Guess which is the 1st comment!</Text>
        </View>
        <View style={styles.answers}>
          {this.renderAnswers.bind(this)()}
        </View>
      </ScrollView>
    )
  }

  render() {
      if (this.props.postsLoading) {
        return this.renderLoadingPostsScreen();
      }
      else if (this.props.postsLoadError) {
        return this.renderErrorScreen();
      }
      else if (this.props.gameOver) {
        return this.renderGameOverScreen();
      }
      else {
        return this.renderPostScreen();
      }
  }
}

function mapStateToProps(state) {
  return state.game
}

var styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'gold',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContainer: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  post: {
    margin: 20,
    padding: 20,
    backgroundColor: '#434f9e',
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
  },
  subredditText: {
    color: '#ffffff',
  },
  titleText: {
    color: '#ffffff',
    marginTop: 20,
    fontSize: 20,
  },
  contentText: {
    color: '#ffffff',
    marginTop: 20,
  },
  instructionText: {
    color: '#f0f0f0',
  },
  answerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    marginLeft: 35,
    marginRight: 35,
    padding: 10
  },
  playAgainText: {
    margin: 20,
  }
});

export default connect(mapStateToProps)(GameScreen);
