import { Observable } from "rxjs";
import shop from '../api/shop'
import {
  FETCH_PRODUCTS,
  ADD_TO_CART_UNSAFE,
  CHECKOUT_REQUEST,
  ADD_TO_CART,
} from '../constants/ActionTypes'
import {receiveAllProducts, receiveInCart, checkoutSuccess} from '../actions'

export const allProductsEpic = (action$) => action$
  .ofType(FETCH_PRODUCTS)
  .mergeMap(_ => Observable.bindCallback(shop.getProducts)())
  .map(receiveAllProducts)

export const addToCartEpic = (action$, store) => action$
  .ofType(ADD_TO_CART_UNSAFE)
  .map(({productId}) => productId)
  .filter(productId => store.getState().products.byId[productId].inventory > 0)
  .map(receiveInCart)

export const checkoutEpic = (action$, store) => action$
  .ofType(CHECKOUT_REQUEST)
  .map(({products}) => products)
  .mergeMap(products => Observable.bindCallback(shop.buyProducts)(products))
  .map(_ => store.getState().cart)
  .map(checkoutSuccess)

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
