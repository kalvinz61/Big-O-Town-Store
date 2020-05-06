import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const ListProduct = product => {
  return (
    <div>
      <div>
        <Link to={`/products/${product.id}`}>{product.name}</Link>
      </div>
      <button>Add to cart</button>
    </div>
  )
}

const mapState = ({product}) => {
  return {
    product
  }
}

export default connect(mapState, null)(ListProduct)
