//* models/account-model.js

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const app = express();
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
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
} /* End of Function: checkExistingEmail() */

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query('SELECT * FROM account WHERE account_email = $1', [account_email]);
        return result.rows[0];
    } catch (error) {
        return new Error('No matching email found.');
    }
} /* End of Function: getAccountByEmail() */

module.exports = { registerAccountModel, checkExistingEmail, getAccountByEmail };