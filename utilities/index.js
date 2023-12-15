//* utilities/index.js

/* ***********************
 * Require Statements
 *************************/
const invModel = require('../models/inventory-model');
const pool = require('../database/');
const jwt = require('jsonwebtoken');
require('dotenv').config();
/* End of Require Statements */

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async (req, res, next) => {
  let data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page" class="navLink">Home</a></li>';
  data.rows.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles" class="navLink">
        ${row.classification_name}
      </a>
    </li>`;
  });
  list += '</ul>';
  return list;
}; /* End of Function: getNav() */

/* ************************
 * Constructs the admin "Add New Vehicle"
 * classifications options list
 ************************** */
Util.newVehicleClassOptions = async (req, res, next) => {
  let data = await invModel.getClassifications();
  let list = ''; // <option label="Select a Classification" disabled>
  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}">${row.classification_name}</option>`;
  });
  return list;
}; /* End of Function: newVehicleClassOptions() */

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li>
        <a class="classificationLink" href="/inv/vehicle/${vehicle.inv_id}" title="View ${
          vehicle.inv_year
        } ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img
            class="thumbnailImg"
            src="${vehicle.inv_thumbnail}"
            alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${
              vehicle.inv_model
            } on CSE Motors">
          <div class="namePrice">
            <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
            <span>MSRP: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </div>
        </a>
      </li>`;
    });
    grid += '</ul>';
  } else {
    grid = '<p class="noVehiclesFound"> Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}; /* End of Function: buildClassificationGrid() */

/* **************************************
 * Build the single vehicle info
 * ************************************ */
Util.buildSingleVehicleInfo = async (data) => {
  let vehicleData = data[0];
  let vehicleElement = `<div class="singleVehicleBox">
    <img src="${vehicleData.inv_image}" alt="Image of ${vehicleData.inv_year} ${
      vehicleData.inv_make
    } ${vehicleData.inv_model}">
    <div class="singleVehicleInfo">
      <h2>${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}</h2>
      <span>MSRP: $${new Intl.NumberFormat('en-US').format(vehicleData.inv_price)}</span>
      <hr>
      <ul>
        <li class="singleVehicleClassification">Type: ${vehicleData.classification_name}</li>
        <li class="singleVehicleMiles">Miles: ${new Intl.NumberFormat('en-US').format(
          vehicleData.inv_miles
        )}</li>
        <li class="singleVehicleColor">Color: ${vehicleData.inv_color}</li>
        <li class="singleVehicleDesc">${vehicleData.inv_description}</li>
      </ul>
    </div>
  </div>`;
  return vehicleElement;
}; /* End of Function: buildSingleVehicleInfo() */

/* **************************************
 * Find Classification Name
 * ************************************ */
Util.findClassificationName = async (classification_id) => {
  const classificationData = await pool.query(
    `SELECT (classification_name) FROM classification WHERE classification_id = $1;`,
    [classification_id]
  );
  const classificationName = classificationData.rows[0].classification_name;
  return classificationName;
}; /* End of Function: findClassificationName() */

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}; /* End of Function: handleErrors() */

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          req.flash('Please log in');
          req.clearCookie('jwt');
          return res.redirect('/account/login');
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
}; /* End of Function: checkJWTToken() */

module.exports = Util;
