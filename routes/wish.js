const express = require('express');
const router = express.Router();
const wishController = require('../controllers/wishlist/wishlist');
const checkLoginAuth = require('../middleware/checkLoginAuth');

router.get('/', checkLoginAuth,wishController.getUserWish);

router.post('/', checkLoginAuth,wishController.addUserWish);

router.delete('/:id', checkLoginAuth,wishController.deleteItemWish);

module.exports = router;
