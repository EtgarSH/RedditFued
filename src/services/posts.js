import _ from 'lodash';

import * as config from '../config'

class PostsService {
  async getTopPostsBySubreddit(num, subreddit) {
    const url = `${config.REDDIT_API}/r/${subreddit}.json?limit=${num}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`PostsService getTopPostsBySubreddit(${num}, ${subreddit}) failed, HTTP status ${response.status}`);
    }
    const data = await response.json()
    const children = _.get(data, 'data.children')

    if (!children) {
      throw new Error(`PostsService getTopPostsBySubreddit failed, children not returned`);
    }
    return children;
  }

  async getAllSubreddits() {
    const url = `${config.REDDIT_API}/subreddits.json`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`PostsService getAllSubreddits failed, HTTP status ${response.status}`);
    }
    const data = await response.json()
    const children = _.get(data, 'data.children')
    const subreddits = _.map(children, (child) => _.get(child, 'data.display_name'))

    if (!subreddits) {
      throw new Error(`PostsService getAllSubreddits failed, subreddits not returned`);
    }
    return subreddits
  }

  async getRandomSubreddit() {
    const subreddits = await this.getAllSubreddits();
    const randomSubreddit = _.sample(subreddits)
    return randomSubreddit
  }

  async getPostsFromRandomSubreddit(limit) {
    const randomSubreddit = await this.getRandomSubreddit()
    const children = await this.getTopPostsBySubreddit(limit, randomSubreddit)
    // console.log('Children from getPostsFromRandomSubreddit: ', children)
    return children
  }

  async getRandomPostsFromAllSubreddits(limit) {
    const children = []
    for (var i = 0; i < limit; i++) {
      const posts = await this.getPostsFromRandomSubreddit(50);
      const post = _.sample(posts)
      // console.log('Random Post: ', post);
      children.push(post)
    }
    return children;
  }

  async getRandomPostFromReddit() {
    const posts = await this.getRandomPostsFromAllSubreddits(1)
    const post = posts[0]
    return post
  }

  async getRandomShortPostFromReddit() {
    let posts = await this.getRandomPostsFromAllSubreddits(1)
    posts = _.filter(posts, async (post) => {
      const comments = await this.getCommentsFromPost(post)
      console.log("comments", comments.length)
      return post.data.selftext.length < 1000 && !post.data.selftext.includes('http') && comments.length >= 4
    })

    if (posts.length == 0) {
      console.log("Hello");
      return await this.getRandomShortPostFromReddit()
    }
    return _.sample(posts)
  }

  async getCommentsFromPost(post) {
    const url = `${config.REDDIT_API}${post.data.permalink}.json`
    console.log(url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('getCommentsFromPost couldn\'t fetch comments...');
    }
    const json = await response.json()
    return await json[1].data.children;
  }
}

export default new PostsService();
