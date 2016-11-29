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

export const updateCart = ({ total, products }) => ({
  type: types.UPDATE_CART,
  total, products,
})

export const checkout = products => ({
  type: types.CHECKOUT_REQUEST,
  products,
})

export const checkoutSuccess = cart => ({
  type: types.CHECKOUT_SUCCESS,
  cart,
})