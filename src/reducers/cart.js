import {
  CHECKOUT_REQUEST,
  CHECKOUT_FAILURE,
  UPDATE_CART,
} from '../constants/ActionTypes'

const initialState = {
  total: "0",
  products: []
}

const cart = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CART:
      const {total, products} = action
      return {...state, total, products}
    case CHECKOUT_REQUEST:
      return initialState
    case CHECKOUT_FAILURE:
      return action.cart
    default:
      return state
  }
}

export default cart
