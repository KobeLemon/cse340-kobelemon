/* ***********************
 * Require Statements
 *************************/
const utilities = require('.');
const { body, validationResult } = require('express-validator');
const invValidate = {}
/* End of Require Statements */

/* ***************************
 *  DATA VALIDATION FUNCTIONS
 * ************************** */

/* ***************************
 *  New Classification Data Validation Rules
 * ************************** */
invValidate.newClassificationRules = () => {
  return [
    // classification_name is required and must be a string with only alphabetic characters
    body('classification_name')
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage('Classification Name does not match the requirements.')
  ];
} /* End of Function: newClassificationRules() */

/* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
invValidate.checkNewClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    })
    return
  }
  next();
}

/* ***************************
 *  New Vehicle Data Validation Rules
 * ************************** */
invValidate.newVehicleRules = async () => {
  // inv_make is required & must be at least 1 character
  body('inv_make')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Make is required and must be at least 1 character'),

  // inv_model is required & must be at least 1 character
  body('inv_model')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Model is required and must be at least 1 character'),

  // inv_year is required & must be a 4 digit number
  body('inv_year')
    .trim()
    .isLength(4)
    .isNumeric()
    .withMessage('Year is required and must be a 4 digit number'),

  // inv_description is required & must be at least 1 character
  body('inv_description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description is required and must be at least 1 character'),

  // inv_image is required & must be a file path
  body('inv_image')
    .trim()
    .isLength({ min: 1 })
    .matches('(^\/.)(\S.)')
    .withMessage('Image Path is required and must be a valid file path'),

  // inv_thumbnail is required & must be a valid file path
  body('inv_thumbnail')
    .trim()
    .isLength({ min: 1 })
    .matches('(^\/.)(\S.)')
    .withMessage('Thumbnail Path is required and must be a valid file path'),

  // inv_price is required & must be at least 1 number
  body('inv_price')
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage('Price is required and must be at least 1 number with no commas or periods'),

  // inv_miles is required & must be at least 1 number with no commas or periods
  body('inv_miles')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Miles are required and must be at least 1 number with no commas or periods'),

  // inv_color is required & must be at least one character & consist of only alphabetic characters
  body('inv_color')
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage('Color is required & must be at least one character & no numbers'),

  // classification_id is required & must be a single digit number or higher.
  // The data for classification_id is auto generated from the database so this
  // shouldn't have issues, but anything is possible
  body('classification_id')
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage('Classification is required. Please pick one.')
}
/* End of Function: newVehicleRules() */

/* ******************************
 * Check data and return errors or continue to add new vehicle
 * ***************************** */
invValidate.checkNewVehicleData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/add-inventory', {
      errors,
      title: "Add New Vehicle",
      nav,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    })
    return
  }
  next();
}
/* End of Function: checkNewVehicleData() */

module.exports = invValidate;