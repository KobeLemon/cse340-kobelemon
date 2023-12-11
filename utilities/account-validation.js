// account-validation.js
/* ***********************
 * Require Statements
 *************************/
const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};
/* End of Require Statements */

/*  **********************************
 *  Registration Data Validation Rules
 *  on error, the string inside the ".withMessage" this message is sent
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be a string with at least one char
    body('account_firstname')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'),

    // lastname is required and must be a string with at least one char
    body('account_lastname')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'),

    // valid email is required and cannot already exist in the DB
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),

    body('account_password')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage('Password does not meet requirements.')
  ];
} /* End of Function: registrationRules() */

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
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
