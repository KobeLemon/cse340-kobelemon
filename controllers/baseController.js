const utilities = require('../utilities/');
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  // req.flash('success', 'Example of a flash success message.');
  // req.flash('notice', 'Example of a flash notice message.');
  // req.flash('error', 'Example of a flash error message.');
  res.render('index', { title: 'Home', nav });
};

module.exports = baseController;
