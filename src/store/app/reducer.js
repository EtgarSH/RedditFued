import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable(
  {
    initialized: false
  }
);

export default function app(state=initialState, action={}) {
  switch (action.type) {
    case types.INITIALIZED:
      return state.merge({
        initialized: true,
      });

    default:
      return state;
  }
}
