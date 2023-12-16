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
Util.buildClassificationList = async (req, res, next) => {
  let data = await invModel.getClassifications();
  console.log('buildClassificationList data.rows');
  console.log(data.rows);
  let selectBox = '';
  data.rows.forEach(row => {
    selectBox += `<option value="${row.classification_id}">${row.classification_name}</option>`;
    console.log('Select tag:');
    console.log(selectBox);
  });
  return selectBox;
}; /* End of Function: buildClassificationList() */

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
};
/* End of Function: checkJWTToken() */

//* The following two funcs are used for ultimately the same purpose: checking if a user is logged in & sending the account if yes & the login page if no, but the nature of the different endpoints for the account router & login router, two different funcs are needed. Both funcs are explained below:

/* ****************************************
 *  Check if a user is still logged in & if yes, then call the "next()" which renders the account page.
 *  If not logged in, then redirect to login page
 *  This function is used on the "router.get('/')" route.
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash('notice', 'Please log into your account, or create a new account.');
    return res.redirect('/account/login');
  }
}

/* ****************************************
 *  Check if a user is still logged in & if yes, then auto-redirect to account which will run the "router.get('/)" route which renders the account page.
 *  If not logged in, then call "next()" to continue to building the login page.
 * This function is used on the "router.get('/login')" route.
 * ************************************ */
Util.redirectToAccountIfLoggedIn = (req, res, next) => {
  if (res.locals.loggedin) {
    res.redirect('/account')
  } else {
    next();
  }
}

module.exports = Util;
