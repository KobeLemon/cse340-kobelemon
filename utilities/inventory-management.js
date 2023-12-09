/* ***********************
 * Require Statements
 *************************/
const pool = require('../database/');
const utilities = require('.');
const { body, validationResult } = require('express-validator');
const invManagement = {}
/* End of Require Statements */

/* ***************************
 *  Insert a new classification into the DB,
 *  then add that classification to the nav
 *  *** ONLY ACCESSIBLE BY ADMINS ***
 * ************************** */
invManagement.addNewClassificationToDB = async (classification_name) => {
  try {
    // console.log('addNewClassificationToDB classification_name');
    // console.log(classification_name);
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message;
  };
}
/* End of Function: addNewClassificationToDB() */

/* ***************************
 *  Insert a new vehicle into the DB
 *  *** ONLY ACCESSIBLE BY ADMINS ***
 * ************************** */
invManagement.addNewVehicleToDB = async (params) => {
  try {

  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  DATA VALIDATION FUNCTIONS
 * ************************** */

/* ***************************
 *  New Classification Data Validation Rules
 * ************************** */
invManagement.newClassificationRules = () => {
  return [
    // classification_name is required and must be a string with only alphabetic characters
    body('classification_name')
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage('Classification Name does not match the requirements.')
  ];
}
/* End of Function: newClassificationRules() */

/* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
invManagement.checkNewClassificationData = async (req, res, next) => {
  // console.log('checkNewClassificationData req.body');
  // console.log(req.body);
  const { classification_name } = req.body;
  let errors = [];
  // console.log('errors array before validationResult');
  // console.log(errors);
  errors = validationResult(req);
  // console.log('errors array after validationResult');
  // console.log(errors);
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

module.exports = invManagement;