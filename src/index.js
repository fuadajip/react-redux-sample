import { connect, Provider } from 'react-redux';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';

function fetchPostsRequest() {
  return {
    type: 'FETCH_REQUEST',
  };
}

function fetchPostsSuccess(payload) {
  return {
    type: 'FETCH_SUCCESS',
    payload,
  };
}

function fetchPostsError() {
  return {
    type: 'FETCH_ERROR',
  };
}

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return state;
    case 'FETCH_SUCCESS':
      return { ...state, posts: action.payload };
    default:
      return state;
  }
};

function fetchPosts() {
  const URL = 'https://jsonplaceholder.typicode.com/posts';
  return fetch(URL, { method: 'GET' })
    .then(response => Promise.all([response, response.json()]));
}

function fetchPostsWithRedux() {
  return (dispatch) => {
    dispatch(fetchPostsRequest());
    return fetchPosts().then(([response, json]) => {
      if (response.status === 200) {
        dispatch(fetchPostsSuccess(json));
      } else {
        dispatch(fetchPostsError());
      }
    });
  };
}

function mapStateToProps(state) {
  console.log(state);
  return {
    posts: state.posts,
  };
}


class About extends React.Component {
  componentDidMount() {
    this.props.fetchPostsWithRedux();
  }
  render() {
    return (
      <div className="main-terms">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-sm-12 col-xs-12">
              <h1>Test About</h1>
            </div>
            <div className="col-md-9 col-sm-12 col-xs-12">
              <h1>asda </h1>
              <ul>
                {
                    this.props.posts &&
                    this.props.posts.map(post => (
                      <li>{post.title} asdavr</li>
                      ))
                  }
              </ul>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

const Container = connect(mapStateToProps, { fetchPostsWithRedux })(About);

const store = createStore(
  reducer,
  applyMiddleware(thunk),
);


ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
