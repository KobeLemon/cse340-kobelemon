const pool = require('../database/');

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

module.exports = { registerAccountModel };