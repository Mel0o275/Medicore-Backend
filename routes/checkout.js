const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkout/checkout');

router.get('/', checkLoginAuth,checkController.getUserOrders);

router.post('/', checkLoginAuth,checkController.addUserAddress);

router.put('/:id', checkLoginAuth,checkController.updateUserAddress);

router.delete('/:id', checkLoginAuth,checkController.deleteUserAddress);

module.exports = router;