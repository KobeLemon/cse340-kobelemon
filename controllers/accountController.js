//* controllers/accountController.js

/* ***********************
 * Require Statements
 *************************/
const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
/* End of Require Statements */

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login to your account!',
    nav,
    errors: null
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

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash('notice', 'Sorry, we encountered an issue with processing the registration. Please retry.');
    res.status(500).render('account/register', {
      title: 'Register your account!',
      nav,
      errors: null
    });
  };

  const regResult = await accountModel.registerAccountModel(account_firstname, account_lastname, account_email, hashedPassword)
  if (regResult) {
    req.flash('success', `Congratulations, ${account_firstname}, you are registered! Please log in below.`);
    res.status(201).render('account/login', {
      title: 'Login to your account!',
      nav,
      errors: null
    });
  } else {
    req.flash('error', 'Sorry, the registration failed. Please retry creating an account.');
    res.status(501).render('account/register', {
      title: 'Register your new account!',
      nav,
      errors: null
    });
  };
} /* End of Function: registerAccount() */

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.');
    res.status(400).render('account/login', {

    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin };
