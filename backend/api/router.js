const express = require('express');
const router = express.Router();

const userController = require('./controllers/user');
const vehiculeController = require('./controllers/vehicule');

// Création des routes

// User
router.route('/user/add').post(userController.add);
router.route('/user/delete').post(userController.delete);
router.route('/user/update').post(userController.update);
router.route('/user/login').post(userController.login);
router.route('/user/login').get(userController.logged);

// Vehicule
router.route('/vehicule/add').post(vehiculeController.add);
router.route('/vehicule/delete').post(vehiculeController.delete);
router.route('/vehicule/update').post(vehiculeController.update);

module.exports = router;