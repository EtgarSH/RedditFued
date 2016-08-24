import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  SrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';
import * as actionTypes from '../store/app/actionTypes';
import * as actions from '../store/game/actions';
// import autobind from 'react-autobind';

// Button types
const START_GAME_BUTTON = "START_GAME_BUTTON";
const SCOREBOARD_BUTTON = "SCOREBOARD_BUTTON";

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    // autobind(this);
    this.buttonClicked = this.buttonClicked.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  buttonClicked(button) {
    switch (button) {
      case START_GAME_BUTTON:
        this.props.dispatch(actions.startGame(this.props.navigator));
      case SCOREBOARD_BUTTON:
        console.log("Scoreboard")
    }
    
  }

  renderButton(buttonType, text) {
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={() => this.buttonClicked(buttonType)}>
          <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderButton(START_GAME_BUTTON, 'Reddit!')}
        {this.renderButton(SCOREBOARD_BUTTON, 'Scoreboard')}
      </View>
    );
    
  }
}

function mapStateToProps(state) {
  return state.app
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#69b0ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  }
});

export default connect(mapStateToProps)(DashboardScreen);
