//* models/inventory-model.js
/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const app = express();
const pool = require('../database/');
/* End of Require Statements */

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query('SELECT * FROM public.classification ORDER BY classification_name');
} /* End of Function: getClassifications() */

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId (classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
      ORDER BY inv_year DESC`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error(`getInventoryByClassificationId error: ${error}`);
  }
} /* End of Function: getInventoryByClassificationId() */

async function getSingleVehicleByVehicleId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      INNER JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error(`getSingleVehicleByVehicleId error: ${error}`);
  }
} /* End of Function: getSingleVehicleByVehicleId() */

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getSingleVehicleByVehicleId
};
