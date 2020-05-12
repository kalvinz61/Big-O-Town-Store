const router = require('express').Router()
const {CartsProducts, Cart, Product} = require('../db/models')

router.get('/', async (req, res, next) => {
  await CartsProducts.findAll().then(products => res.send(products))
})

router.post('/', async (req, res, next) => {
  const cart = await Cart.findOne({
    where: {
      userId: req.user.id
    }
  })
  const foundItem = await CartsProducts.findOne({
    where: {
      cartId: cart.id,
      productId: req.body.product.id
    }
  })
  if (foundItem) {
    foundItem.update({quantity: foundItem.quantity + req.body.quantity})
    await Cart.findOne({
      where: {
        userId: req.user.id
      },
      include: {
        model: Product,
        where: {
          id: req.body.product.id
        }
      }
    }).then(updatedCart => {
      res.send(updatedCart.products[0])
    })
  } else {
    await CartsProducts.create({
      cartId: cart.id,
      productId: req.body.product.id,
      quantity: req.body.quantity
    })

    await Cart.findOne({
      where: {
        userId: req.user.id
      },
      include: {
        model: Product,
        where: {
          id: req.body.product.id
        }
      }
    }).then(updatedCart => {
      res.send(updatedCart.products[0])
    })
  }
})

router.delete('/', (req, res, next) => {
  CartsProducts.findOne({
    where: {
      cartId: req.body.cartId,
      productId: req.body.productId
    }
  }).then(cartItem => {
    cartItem.destroy()
    res.status(202).send('deleted item from cart')
  })
})

module.exports = router
