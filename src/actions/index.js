import * as types from '../constants/ActionTypes'

export const onLoad = () => ({
  type: types.ON_LOAD
})

export const receiveAllProducts = products => ({
  type: types.RECEIVE_PRODUCTS,
  products
})

export const recieveUser = user => ({
  type: types.RECEIVE_USER,
  ...user
})

export const addToCart = productId => ({
  type: types.ADD_TO_CART_UNSAFE,
  productId
})

export const receiveInCart = productId => ({
  type: types.ADD_TO_CART,
  productId
})

export const updateCart = (cart) => ({
  ...cart,
  type: types.UPDATE_CART,
})

export const checkout = total => ({
  type: types.CHECKOUT_REQUEST,
  total,
})

export const checkoutSuccess = cart => ({
  type: types.CHECKOUT_SUCCESS,
  cart,
})