//* routes/accountRoute.js

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');
/* End of Require Statements */

// Route to build the account management page
router.get('/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountHome)
);

// Route to build the account login page
router.get('/login',
  utilities.redirectToAccountIfLoggedIn,
  utilities.handleErrors(accountController.buildLogin)
);

// Route to process the login request
router.post('/login',
//   (req, res) => { res.status(200).send('login process')}
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build the account register page
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Route to post the new account to the database
router.post('/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;