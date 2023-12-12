//* utilities/account-validation.js

/* ***********************
 * Require Statements
 *************************/
const utilities = require('.');
const { check, validationResult } = require('express-validator');
const validate = {};
/* End of Require Statements */

/*  **********************************
 *  Registration Data Validation Rules
 *  on error, the string inside the ".withMessage" this message is sent
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be a string with at least one char
    check('account_firstname', 'Please provide a valid first name.')
      .trim()
      .isLength({ min: 1 }),

    // lastname is required and must be a string with at least one char
    check('account_lastname', 'Please provide a valid last name.')
      .trim()
      .isLength({ min: 2 }),

    // valid email is required and cannot already exist in the DB
    check('account_email', 'Please provide a valid email.')
      .trim()
      .isEmail()
      .normalizeEmail(),

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
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.check;
  let errors = [];
  errors = validationResult(req);
  if (errors.length > 0) {
    let nav = await utilities.getNav();
    res.render('account/register', {
      errors,
      title: 'Register your new account!',
      nav,
      account_firstname,
      account_lastname,
      account_email
    })
    return
  }
  next()
} /* End of Function: checkRegData() */

module.exports = validate;
