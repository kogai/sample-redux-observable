/**
 * Mocking client-server processing
 */
import _products from './products.json'

const TIMEOUT = 100

export default {
  getProducts: (cb) => setTimeout(() => cb(_products), TIMEOUT),
  buyProducts: (payload, cb) => setTimeout(() => cb(), TIMEOUT)
}
