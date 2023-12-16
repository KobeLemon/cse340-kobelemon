//* utilities/account-validation.js

/* ***********************
 * Require Statements
 *************************/
const utilities = require('.');
const { check, validationResult } = require('express-validator');
const validate = {};
const accountModel = require('../models/account-model');
/* End of Require Statements */

/*  **********************************
 *  Account Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be a string with at least one char
    check('account_firstname', 'Please provide a valid first name.')
      .trim()
      .isLength({ min: 1 })
      .isAlpha(),

    // lastname is required and must be a string with at least one char
    check('account_lastname', 'Please provide a valid last name.')
      .trim()
      .isLength({ min: 1 })
      .isAlpha(),

    // email is required and cannot already exist in the DB
    check('account_email', 'Please provide a valid email.')
      .trim()
      .isLength({ min: 1})
      .isEmail()
      .normalizeEmail()
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error(`'${account_email}' has already been registered to an account. Please log in or use a different email.`)
        }
      }),
    // password is required and must have 12 characters total, at least 1 capital letter, at least 1 number, & at least 1 special character
    check('account_password', 'Password does not meet requirements.')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
  ];
}
/* End of Function: registrationRules() */

/* ******************************
 * Check account registration data and
 *   return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errorsObj = [];
  errorsObj = validationResult(req);
  let errorsArray = errorsObj.errors;
  if (errorsArray.length > 0) {
    let nav = await utilities.getNav();
    res.render('account/register', {
      errors: errorsArray,
      title: 'Register your new account!',
      nav,
      account_firstname,
      account_lastname,
      account_email,
      // username: locals.user
    })
    return
  }
  next()
} /* End of Function: checkRegData() */

/*  **********************************
 *  Account Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // email is required
    check('account_email', 'Email or password may be incorrect. Please check your credentials and retry.')
      .trim()
      .isEmail()
      .normalizeEmail(),

    // password is required and must have 12 characters total, at least 1 capital letter, at least 1 number, & at least 1 special character
    check('account_password', 'Email or password may be incorrect. Please check your credentials and retry.')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
  ];
}/* End of Function: loginRules() */

/* ******************************
 * Check account login data and return errors
 *  or continue to login to the account
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errorsObj = [];
  errorsObj = validationResult(req);
  let errorsArray = errorsObj.errors;
//   console.log('errorsArray[1]');
//   console.log(errorsArray[1]);
  if (errorsArray.length == 2) {
    delete errorsArray[1];
    // console.log('errorsArray[1] deleted');
    // console.log('new errorsArray');
    console.log(errorsArray);
  }

  if (errorsArray.length > 0) {
    let nav = await utilities.getNav();
    res.render('account/login', {
      errors: errorsArray,
      title: 'Login to your account!',
      nav,
      account_email,
      account_password,
      // username: locals.user
    })
    return
  }
  next();
} /* End of Function: checkLoginData() */

module.exports = validate;
