import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import thunk from 'redux-thunk';
import * as reducers from './store/reducers';
import * as appActions from './store/app/actions';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

import { registerScreens } from './screens';
registerScreens(store, Provider);

export default class App {
  constructor() {
    store.dispatch(appActions.appInitialized());
  }

  startApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'redditfued.DashboardScreen',
        title: 'RedditFued',
        navigatorStyle: {}
      }
    })
  }
}
