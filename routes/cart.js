const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart/cart');
const checkLoginAuth = require('../middleware/checkLoginAuth');

router.get('/', checkLoginAuth,cartController.getUserCart);

router.post('/', checkLoginAuth,cartController.addUserCart);

router.delete('/', checkLoginAuth,cartController.clearUserCart);

router.delete('/:id', checkLoginAuth,cartController.deleteItemCart);

router.patch('/:id/:operator', checkLoginAuth,cartController.updateUserCart);

module.exports = router;
