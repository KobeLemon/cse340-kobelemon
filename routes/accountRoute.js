const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');

// Route to build the account login page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to build the account register page
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Route to post the new account to the database
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;