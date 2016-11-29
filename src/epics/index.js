import { Observable } from "rxjs";
import {getProducts, buyProducts, getUser} from '../api'
import {
  ON_LOAD,
  ADD_TO_CART_UNSAFE,
  CHECKOUT_REQUEST,
  ADD_TO_CART,
} from '../constants/ActionTypes'
import UserTypes from '../constants/UserTypes'
import {receiveAllProducts, receiveInCart, checkoutSuccess, updateCart, recieveUser} from '../actions'

export const allProductsEpic = action$ => action$
  .ofType(ON_LOAD)
  .mergeMap(_ => Observable.bindCallback(getProducts)())
  .map(receiveAllProducts)

export const addToCartEpic = (action$, store) => action$
  .ofType(ADD_TO_CART_UNSAFE)
  .map(({productId}) => productId)
  .filter(productId => store.getState().products.byId[productId].inventory > 0)
  .map(receiveInCart)

export const checkoutEpic = (action$, store) => action$
  .ofType(CHECKOUT_REQUEST)
  .map(({products}) => products)
  .mergeMap(products => Observable.bindCallback(buyProducts)(products))
  .map(_ => store.getState().cart)
  .map(checkoutSuccess)

const userEpic = action$ => action$
  .ofType(ON_LOAD)
  .mergeMap(_ => Observable.bindCallback(getUser)())
  .map(recieveUser)

export const cartEpic = (action$, store) => {
  const productId$ = Observable.merge(
    action$.ofType(ADD_TO_CART).map(({ productId }) => productId),
    action$.ofType(CHECKOUT_REQUEST).mapTo(null)
  )

  const addedIds$ = productId$
    .scan((addedIds, id) => {
        if (id === null) {
          return []
        }
        return addedIds.indexOf(id) !== -1 ? addedIds : [...addedIds, id]
      }, [])

  const quantityById$ = productId$
    .scan((quantityById, id) => {
      if (id === null) {
        return {}
      }
      return { ...quantityById, [id]: (quantityById[id] || 0) + 1 }
    }, {})

  return Observable
    .combineLatest(addedIds$, quantityById$, (addedIds, quantityById) => ({addedIds, quantityById}))
    .map(({addedIds, quantityById}) => {
      const {byId} = store.getState().products

      const total = addedIds
          .reduce((acc, id) => acc + byId[id].price * (quantityById[id] || 0), 0)
          .toFixed(2)

      const products = addedIds
          .map(id => ({
            ...byId[id],
            quantity: quantityById[id] || 0,
          }))

      return updateCart({
        total,
        products
      })
    })
}
