//* controllers/accountController.js

/* ***********************
 * Require Statements
 *************************/
const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
/* End of Require Statements */

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login to your account!',
    nav
  });
} /* End of Function: buildLogin() */


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register your new account!',
    nav,
    errors: null
  });
} /* End of Function: buildRegister() */

/* ****************************************
*  Process Account Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  const regResult = await accountModel.registerAccountModel(account_firstname, account_lastname, account_email, account_password)
  if (regResult) {
    req.flash('success', `Congratulations, ${account_firstname}, you are registered! Please log in below.`);
    res.status(201).render('account/login', {
      title: 'Login to your account!',
      nav
    });
  } else {
    req.flash('error', 'Sorry, the registration failed. Please retry creating an account.');
    res.status(501).render('account/register', {
      title: 'Register your new account!',
      nav
    });
  };
} /* End of Function: registerAccount() */

module.exports = { buildLogin, buildRegister, registerAccount };
