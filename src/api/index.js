/**
 * Mocking client-server processing
 */
import _products from './products.json'
import _user from './user'

const TIMEOUT = 100

export const getProducts = (cb) => setTimeout(() => cb(_products), TIMEOUT)
export const buyProducts = (payload, cb) => setTimeout(() => cb(), TIMEOUT)
export const getUser = (cb) => setTimeout(() => cb(_user), TIMEOUT)
