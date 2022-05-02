const express = require('express');
const router = express.Router();

const userController = require('./controllers/user');

// Création des routes

// User
router.route('/user/add').post(userController.add);
router.route('/user/delete').post(userController.delete);
router.route('/user/update').post(userController.update);
router.route('/user/login').post(userController.login);
router.route('/user/login').get(userController.logged);

module.exports = router;