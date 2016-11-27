import { Observable } from "rxjs";
import shop from '../api/shop'
import * as types from '../constants/ActionTypes'

export const getAllProducts = () => ({
  type: types.FETCH_PRODUCTS
})

export const allProductsEpic = (action$) => action$
  .ofType(types.FETCH_PRODUCTS)
  .mergeMap(_ => Observable.bindCallback(shop.getProducts)())
  .map(products => ({
    type: types.RECEIVE_PRODUCTS,
    products
  }))

export const addToCart = productId => ({
  type: types.ADD_TO_CART_UNSAFE,
  productId
})

export const addToCartEpic = (action$, store) => action$
  .ofType(types.ADD_TO_CART_UNSAFE)
  .filter(({productId}) => store.getState().products.byId[productId].inventory > 0)
  .map(({productId}) => ({
    type: types.ADD_TO_CART,
    productId
  }))

export const checkout = products => ({
  type: types.CHECKOUT_REQUEST,
  products,
})

export const checkoutEpic = (action$, store) => action$
  .ofType(types.CHECKOUT_REQUEST)
  .mergeMap(({products}) => Observable.bindCallback(shop.buyProducts)(products))
  .map(_response => ({
    type: types.CHECKOUT_SUCCESS,
    cart: store.getState().cart,
  }))
