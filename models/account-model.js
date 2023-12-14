//* models/account-model.js

/* ***********************
 * Require Statements
 *************************/
const pool = require('../database/');
/* End of Require Statements */

/* *****************************
*   Register new account
* *************************** */
async function registerAccountModel(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";

    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
  } catch (error) {
    return error.message;
  };
} /* End of Function: registerAccountModel() */

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account where account_email = $1";
    const email = await pool.query(sql, [account_email]);
    console.log("checkExistingEmail email");
    console.log(email);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
} /* End of Function: checkExistingEmail() */

module.exports = { registerAccountModel, checkExistingEmail };