import {
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE,
  UPDATE_CART,
} from '../constants/ActionTypes'

const initialState = {
  total: "0",
  discountRate: 0.0,
  products: []
}

const cart = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CART:
      const {total, products, discountRate} = action
      return {...state, total, products, discountRate}
    case CHECKOUT_SUCCESS:
      return initialState
    case CHECKOUT_FAILURE:
      return action.cart
    default:
      return state
  }
}

export default cart
