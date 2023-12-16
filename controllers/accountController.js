//* controllers/accountController.js

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const app = express();
const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
require('dotenv').config();
/* End of Require Statements */

/* ****************************************
*  Deliver account view when logged in
* *************************************** */
async function buildAccountHome(req, res, next) {
    let nav = await utilities.getNav();
    res.render('account/index', {
        title: 'Welcome to your account!',
        nav,
        errors: null,
        // username: locals.user
    });
} /* End of Function: buildAccountHome() */

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login to your account!',
    nav,
    errors: null,
    // username: locals.user
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
    errors: null,
    // username: locals.user
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
        title: 'Login to your account!',
        nav,
        errors: null,
        account_email
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password;
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        // res.cookie()
        // app.locals.user = accountData.account_firstname;
        // console.log('app.locals.user');
        // console.log(app.locals.user);
        return res.redirect('/account/');
    }
  } catch (error) {
    return new Error('Access Forbidden');
  }
}

// Log out of the account
function logout(req, res, next) {
  res.clearCookie('jwt');
  res.locals.accountData = null;
  res.locals.loggedin = 0;
  res.status(200).redirect('/');
  return req.flash('success', 'You have logged out of your account. Come back soon!')
}

module.exports = { buildAccountHome, buildLogin, buildRegister, registerAccount, accountLogin, logout};
