import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable(
  {
    inGame: false,
    gameOver: false,
    postsLoading: true,
    postsLoadError: undefined,
    post: undefined,
    points: 0,
  }
);

export default function game(state=initialState, action={}) {
  switch (action.type) {
    case types.START_GAME:
      return state.merge({
        inGame: true,
        gameOver: false,
        points: 0,
      });

    case types.STOP_GAME:
      return state.merge({
        inGame: false,
      });

    case types.FETCH_POSTS_LOADING:
      return state.merge({
        postsLoading: true,
      });

    case types.FETCH_POSTS_SUCCESS:
      return state.merge({
        postsLoading: false,
        post: action.post,
        postsLoadError: undefined,
      });

    case types.FETCH_POSTS_FAILURE:
      return state.merge({
        postsLoading: false,
        postsLoadError: action.error
      });

    case types.RIGHT_ANSWER:
      return state.merge({
        points: state.points + 5,
      });

    case types.WRONG_ANSWER:
      return state.merge({
        gameOver: true,
      })

    default:
      return state;
  }
}
