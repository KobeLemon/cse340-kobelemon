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
    let test;
  } catch (error) {
    return error.message;
  };
}
/* End of Function: registerAccountModel() */

module.exports = { registerAccountModel };