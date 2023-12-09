/* ***********************
 * Require Statements
 *************************/
const utilities = require('../utilities/');
const baseController = {};
/* End of Require Statements */

/* ***********************
 * Build the home page view
 *************************/
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  // req.flash('success', 'Example of a flash success message.');
  // req.flash('notice', 'Example of a flash notice message.');
  // req.flash('error', 'Example of a flash error message.');
  res.render('index', { title: 'Home', nav });
};
/* End of Function: buildHome() */

module.exports = baseController;
