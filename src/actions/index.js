import { Observable } from "rxjs";
import shop from '../api/shop'
import * as types from '../constants/ActionTypes'

const receiveProducts = products => ({
  type: types.RECEIVE_PRODUCTS,
  products: products
})

export const getAllProducts = () => dispatch => {
  shop.getProducts(products => {
    dispatch(receiveProducts(products))
  })
}

const addToCartUnsafe = productId => ({
  type: types.ADD_TO_CART,
  productId
})

export const addToCart = productId => (dispatch, getState) => {
  if (getState().products.byId[productId].inventory > 0) {
    dispatch(addToCartUnsafe(productId))
  }
}

export const checkout = products => dispatch => {
  dispatch({
    type: types.CHECKOUT_REQUEST,
    products,
  })
  /**
  shop.buyProducts(products, () => {
    dispatch({
      type: types.CHECKOUT_SUCCESS,
      cart
    })
    // Replace the line above with line below to rollback on failure:
    // dispatch({ type: types.CHECKOUT_FAILURE, cart })
  })
  */
}

export const checkoutEpic = (action$, store) => action$
  .ofType(types.CHECKOUT_REQUEST)
  .mergeMap(products => Observable.bindCallback(shop.buyProducts)(products))
  .map(_response => ({
    type: types.CHECKOUT_SUCCESS,
    cart: store.getState(),
  }))
