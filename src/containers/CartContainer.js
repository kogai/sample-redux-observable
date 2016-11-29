import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { checkout } from '../actions'
import Cart from '../components/Cart'

const CartContainer = ({ products, total, checkout }) => (
  <Cart
    products={products}
    total={total}
    onCheckoutClicked={() => checkout(products)} />
)

CartContainer.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired
  })).isRequired,
  total: PropTypes.string,
  checkout: PropTypes.func.isRequired
}

const mapStateToProps = ({ cart }) => {
  const {products, total} = cart
  return ({
    products,
    total,
})
}

const mapDispatchToProps = dispatch => ({
  checkout: products => dispatch(checkout(products)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartContainer)
