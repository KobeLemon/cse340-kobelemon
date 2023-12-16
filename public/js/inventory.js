//* public/js/inventory.js

'use strict'

/* ***************************
 *  Get a list of items in inventory
 *  based on the classification_id
 * ************************** */
let classificationList = document.querySelector('#classificationList');
classificationList.addEventListener('change', () => {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = `/inv/getInventory/${classification_id}`;
  fetch(classIdURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error('Network response was not okay.');
    })
    .then((data) => {
      console.log('inventory.js data');
      console.log(data);
      buildInventoryList(data);
    })
    .catch((error) => {
      console.log(`There was a problem: ${error.message}`);
    })
}) /* End of classificationList.addEventListener('change') */

/* ***************************
 *  Get a list of items in inventory
 *  based on the classification_id
 * ************************** */
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById('inventoryDisplay');
  // Set up the table labels & table body
  let dataTable = '<thead><tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr></thead>';
  // Set up the table body
  dataTable += '<tbody>';
  // Iterate over all vehicles in the array and put each in a row
  data.forEach((element) => {
    console.log(`${element.inv_id}, ${element.inv_model}`);
    dataTable += `
    <tr>
      <td>${element.inv_make} ${element.inv_model}</td>
      <td><a href="/inv/edit${element.inv_id}" title="Click to modify">Modify</a></td>
      <td><a href="/inv/delete${element.inv_id}" title="Click to delete">Delete</a></td>
    </tr>`;
  });
  dataTable += '</tbody>';
  // Display the contents in the Inventory Management View
  inventoryDisplay.innerHTML = dataTable;
} /* End of Function: buildInventoryList() */