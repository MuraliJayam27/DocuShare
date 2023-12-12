const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

router.post('/create', userController.createUser);
router.post('/verify', userController.loginUser);
module.exports = router;
