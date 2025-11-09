const express = require('express');
const router = express.Router();
const wishController = require('../controllers/wishlist/wishlist');

router.get('/', wishController.getUserWish);

router.post('/', wishController.addUserWish);

router.delete('/:id', wishController.deleteItemWish);

module.exports = router;
