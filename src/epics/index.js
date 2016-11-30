import { Observable } from "rxjs";
import {getProducts, buyProducts, getUser} from '../api'
import {
  ON_LOAD,
  ADD_TO_CART_UNSAFE,
  CHECKOUT_REQUEST,
  ADD_TO_CART,
  RECEIVE_USER,
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

export const userEpic = action$ => {
  const user$ = action$
    .ofType(ON_LOAD)
    .mergeMap(_ => Observable.bindCallback(getUser)())

  const total$ = action$
    .ofType(CHECKOUT_REQUEST)
    .map(({total}) => ({ amount: Number(total) }))

  return user$
    .merge(total$)
    .scan((acc, next) => ({
      amount: acc.amount + next.amount,
      userType: acc.userType,
    }))
    .map(user => ({
      ...user,
      // プレミアムユーザー・支払い総額が1000ドルを超えるユーザーはそれぞれ割引率が追加される
      discountRate: (user.userType === UserTypes.PREMIUM ? 0.1 : 0) + (user.amount > 1000 ? 0.1 : 0)
    }))
    .map(recieveUser)
}

export const cartEpic = (action$, store) => {
  const productId$ = Observable.merge(
    action$.ofType(ADD_TO_CART).pluck("productId"),
    action$.ofType(CHECKOUT_REQUEST).mapTo(null)
  )

  const addedIds$ = productId$
    .scan((addedIds, id) => {
        if (id === null) { return [] }
        return addedIds.indexOf(id) !== -1 ? addedIds : [...addedIds, id]
      }, [])

  const quantityById$ = productId$
    .scan((quantityById, id) => {
      if (id === null) { return {} }
      return { ...quantityById, [id]: (quantityById[id] || 0) + 1 }
    }, {})

  const discountRate$ = action$.ofType(RECEIVE_USER).pluck("discountRate")

  return Observable
    .combineLatest(addedIds$, quantityById$, discountRate$, (addedIds, quantityById, userDiscountRate) => ({addedIds, quantityById, userDiscountRate}))
    .map(({addedIds, quantityById, userDiscountRate}) => {
      const {byId} = store.getState().products

      const total = addedIds
        .reduce((acc, id) => acc + byId[id].price * (quantityById[id] || 0), 0)
        .toFixed(2)

      const products = addedIds
        .map(id => ({
          ...byId[id],
          quantity: quantityById[id] || 0,
        }))

      const totalQuantity = addedIds
        .reduce((acc, id) => acc + (quantityById[id] || 0), 0)

      const discountRate = (totalQuantity >= 3 ? 0.3 : 0) + userDiscountRate

      return updateCart({
        total,
        products,
        discountRate,
      })
    })
}
