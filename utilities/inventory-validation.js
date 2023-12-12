//* utilities/inventory-validation.js

/* ***********************
 * Require Statements
 *************************/
const utilities = require('.');
const { check, validationResult } = require('express-validator');
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
    check('classification_name', 'Classification Name does not match the requirements.')
    .trim()
    .isAlpha()
    .isLength({ min: 1 })
  ];
} /* End of Function: newClassificationRules() */

/* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
invValidate.checkNewClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req).array({ onlyFirstError: true});
  if (errors.length > 0) {
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
invValidate.newVehicleRules = () => {
  return [
    // classification_id is required & must be a single digit number or higher.
    // The data for classification_id is auto generated from the database so this
    // shouldn't have issues, but anything is possible
    check('classification_id', 'Classification is required. Please pick one.')
      .trim()
      .isLength({ min: 1 })
      .isNumeric(),

    // inv_make is required & must be at least 1 character
    check('inv_make', 'Make is required and must be at least 1 character.')
      .trim()
      .isLength({ min: 1 }),

    // inv_model is required & must be at least 1 character
    check('inv_model', 'Model is required and must be at least 1 character.')
      .trim()
      .isLength({ min: 1 }),

      // inv_description is required & must be at least 1 character
    check('inv_description', 'Description is required and must be at least 1 character.')
      .trim()
      .isLength({ min: 1 }),

    // inv_image is required & must be a file path
    check('inv_image', 'Image Path is required and must be a valid file path.')
      .trim()
      .isLength({ min: 1 })
      .matches('(^\/.)(\S.)'),

    // inv_thumbnail is required & must be a valid file path
    check('inv_thumbnail', 'Thumbnail Path is required and must be a valid file path.')
      .trim()
      .isLength({ min: 1 })
      .matches('(^\/.)(\S.)'),

    // inv_price is required & must be at least 1 number
    check('inv_price', 'Price is required and must be at least 1 number with no commas or periods.')
      .trim()
      .isLength({ min: 1 })
      .isNumeric(),

    // inv_year is required & must be a 4 digit number
    check('inv_year', 'Year is required and must be a 4 digit number.')
      .trim()
      .isLength(4)
      .isNumeric(),

    // inv_miles is required & must be at least 1 number with no commas or periods
    check('inv_miles', 'Miles are required and must be at least 1 number with no commas or periods.')
      .trim()
      .isLength({ min: 1 })
      .isNumeric(),

    // inv_color is required & must be at least one character & consist of only alphabetic characters
    check('inv_color', 'Color is required & must be at least one character & no numbers.')
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
  ]
}
/* End of Function: newVehicleRules() */

/* ******************************
 * Check data and return errors or continue to add new vehicle
 * ***************************** */
invValidate.checkNewVehicleData = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  let errors = [];
  errors = validationResult(req).array({ onlyFirstError: true});
  if (errors.length > 0) {
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