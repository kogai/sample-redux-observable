import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import reducer from './reducers'
import { getAllProducts, checkoutEpic } from './actions'
import App from './containers/App'

export const rootEpic = combineEpics(checkoutEpic)
const epicMiddleware = createEpicMiddleware(rootEpic);

const middleware = [thunk ,epicMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

store.dispatch(getAllProducts())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
