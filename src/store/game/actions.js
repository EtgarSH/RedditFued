import * as types from './actionTypes';
import postsService from '../../services/posts'

export function startGame(navigator) {
  return async function(dispatch, getState) {
    dispatch({type: types.START_GAME});
    navigator.showModal(
      {
        screen: 'redditfued.GameScreen',
        title: 'Game',
        navigatorButtons: {
          leftButtons: [
            {
              title: 'Menu',
              id: 'menu',
            }
          ],
        }

      }
    );
    dispatch(fetchNewPost())
  }
}

export function fetchNewPost() {
  return async function(dispatch, getState) {
    try {
      dispatch({type: types.FETCH_POSTS_LOADING})
      const post = await postsService.getRandomShortPostFromReddit();
      post.comments = await postsService.getCommentsFromPost(post);
      dispatch({type: types.FETCH_POSTS_SUCCESS, post});
    }
    catch (error) {
      dispatch({type: types.FETCH_POSTS_FAILURE, error})
      console.log('Error: ', error.message)
    }
  }
}

export function stopGame(navigator) {
  return async function(dispatch, getState) {
    dispatch({type: types.STOP_GAME});
    navigator.dismissModal({
      animationType: 'slide-down',
    });
  }
}
