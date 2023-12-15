//* ROOT/server.js

/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const static = require('./routes/static');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const utilities = require('./utilities/index');
const session = require('express-session');
const pool = require('./database/');
const accountRoute = require('./routes/accountRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
/* End of Require Statements */

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionsId'
}))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
})
/* End of Express Messages Middleware */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());
app.use(utilities.checkJWTToken);
/* End of Middleware */

/* ***********************
 * View Engine & Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');
/* End of View Engine & Templates */

/* ***********************
 * Routes
 *************************/
app.use(static);

// Account Route
app.use('/account', utilities.handleErrors(accountRoute));

// Inventory Route
app.use('/inv', utilities.handleErrors(inventoryRoute));

// Index Route
app.get('/', utilities.handleErrors(baseController.buildHome));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, pageNotFoundMessage: 'Sorry, we appear to have lost that page'});
});
/* End of Routes */

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  // console.log(err);
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || '500 Server Error',
    message: err.pageNotFoundMessage || "Sorry the site appears to be having issues. Please try again later.",
    nav
  })
})
/* End of Express Error Handler */

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;
/* End of Local Server Information */

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
/* End of Server Confirmation */
