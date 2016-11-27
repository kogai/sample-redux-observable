import { Observable } from "rxjs";
import shop from '../api/shop'
import * as types from '../constants/ActionTypes'
import {receiveAllProducts, receiveInCart, checkoutSuccess} from '../actions'

export const allProductsEpic = (action$) => action$
  .ofType(types.FETCH_PRODUCTS)
  .mergeMap(_ => Observable.bindCallback(shop.getProducts)())
  .map(receiveAllProducts)

export const addToCartEpic = (action$, store) => action$
  .ofType(types.ADD_TO_CART_UNSAFE)
  .map(({productId}) => productId)
  .filter(productId => store.getState().products.byId[productId].inventory > 0)
  .map(receiveInCart)

export const checkoutEpic = (action$, store) => action$
  .ofType(types.CHECKOUT_REQUEST)
  .map(({products}) => products)
  .mergeMap(products => Observable.bindCallback(shop.buyProducts)(products))
  .map(_ => store.getState().cart)
  .map(checkoutSuccess)
