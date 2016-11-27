import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import reducer from './reducers'
import { fetchAllProducts } from './actions'
import { checkoutEpic, allProductsEpic, addToCartEpic } from './epics'
import App from './containers/App'

export const rootEpic = combineEpics(checkoutEpic, allProductsEpic, addToCartEpic)
const epicMiddleware = createEpicMiddleware(rootEpic);

const middleware = [epicMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

store.dispatch(fetchAllProducts())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
