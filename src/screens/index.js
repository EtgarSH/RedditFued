import { Navigation } from 'react-native-navigation';

import DashboardScreen from './DashboardScreen';
import GameScreen from './GameScreen';

export function registerScreens(store, provider) {
  Navigation.registerComponent('redditfued.DashboardScreen', () => DashboardScreen, store, provider);
  Navigation.registerComponent('redditfued.GameScreen', () => GameScreen, store, provider);
}
