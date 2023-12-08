const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');

// Route to build the account login page
router.get('/', utilities.handleErrors(accountController.buildLogin));

module.exports = router;