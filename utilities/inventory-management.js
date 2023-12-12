//* utilities/inventory-management.js

/* ***********************
 * Require Statements
 *************************/
const pool = require('../database/');
const invManagement = {}
/* End of Require Statements */

/* ***************************
 *  Insert a new classification into the DB,
 *  then add that classification to the nav
 *  *** ONLY ACCESSIBLE BY ADMINS ***
 * ************************** */
invManagement.addNewClassificationToDB = async (classification_name) => {
  try {
    let sql = "INSERT INTO classification (classification_name) VALUES ($1);";
    return await pool.query(sql, [ classification_name ])
  } catch (error) {
    return error.message;
  };
} /* End of Function: addNewClassificationToDB() */

/* ***************************
 *  Insert a new vehicle into the DB
 *  *** ONLY ACCESSIBLE BY ADMINS ***
 * ************************** */
invManagement.addNewVehicleToDB = async (params) => {
  try {
    let sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, );";
    return await pool.query(sql, [ inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id ]);
  } catch (error) {
    return error.message;
  }
} /* End of Function: addNewClassificationToDB() */

module.exports = invManagement;