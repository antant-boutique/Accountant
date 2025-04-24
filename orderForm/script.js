var modelsInputs = document.querySelectorAll('input[name="models[]"]');
modelsInputs[0].parentNode.parentNode.setAttribute('prefilled', 'true');

function addRow() {
  var table = document.querySelector('table');
  var newRow = table.insertRow(table.rows.length);
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  cell1.innerHTML = '<input type="text" name="models[]" id="models" required>';
  //cell2.innerHTML = '<input type="number" name="quantities[]" required oninput="calculateTotal()">';
  //cell2.innerHTML = '<input type="number" name="quantities[]" id="quantities" required>';
  cell2.innerHTML = '<label class="rounded-checkbox"><input type="checkbox" name="fullpaid" id="stepbox" value="on"></label>';
  cell1.parentNode.parentNode.setAttribute('prefilled', 'false');
  document.getElementById('total-container').style.display = 'none';
  document.getElementById('pay-container').style.display = 'none';
}

// Function to delete a row from the table
function deleteRow(button) {
  var table = document.querySelector('table');
  var rowIndex = table.rows.length - 1;
  var row = table.rows[rowIndex];

  // Check if the row is prefilled
  if (row.getAttribute('prefilled') !== 'true') {
    table.deleteRow(rowIndex);
  } else {
    document.getElementById('total-container').style.display = 'block';
    document.getElementById('pay-container').style.display = 'block';
  }
  //calculateTotal();
}


function goToPage(page) {
  document.getElementById('page1').style.display = page === 1 ? 'block' : 'none';
  document.getElementById('page2').style.display = page === 2 ? 'block' : 'none';
  //document.getElementById('page3').style.display = page === 3 ? 'block' : 'none';
  //calculatePayable();
}

function finishPage(page) {
  var form = document.getElementById('textileForm');
  var jsonData = new FormData(form);
  var formData = {};
  jsonData.forEach((value, key) => {
    if (!formData[key]) {
      formData[key] = [];
      }
    formData[key].push(value);
  });
  console.log(formData); // Replace with your desired action (e.g., send to server)
}

function toggleCostInput(checkbox, inputName) {
  var costInput = document.querySelector('input[name="' + inputName + '"]');
  costInput.disabled = !checkbox.checked;
  //calculatePayable();
}

function togglePaidInput(checkbox, inputName) {
  var costInput = document.querySelector('input[name="' + inputName + '"]');
  costInput.disabled = checkbox.checked;
}

//function toggleProdPrice(checkbox) {
//  var costInput = document.querySelector('input[name="productPrice"]');
//  costInput.disabled = checkbox.checked;
//}

// Function to parse URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Function to prefill entries from URL
function prefillFormFromUrl() {
  // Get values from URL parameters
  var customerName = getParameterByName('customerName');
  var customerContact = getParameterByName('customerContact');
  var customerAddress = getParameterByName('customerAddress');
  var modelValues = getParameterByName('models');
  var quantityValues = getParameterByName('stepboxes');

  // Prefill values in the form
  if (customerName) {
    document.querySelector('input[name="customerName"]').value = customerName;
  }

  if (customerContact) {
    document.querySelector('input[name="customerContact"]').value = customerContact;
  }

  if (customerAddress) {
    document.querySelector('input[name="customerAddress"]').value = customerAddress;
  }

  if (modelValues) {
    var modelsInputs = document.querySelectorAll('input[name="models[]"]');
    var values = modelValues.split(',');
    values.forEach((value, index) => {
      if (index === 0) {
        // If it's the first value, set it in the default row
        if (modelsInputs[index]) {
          modelsInputs[index].value = value;
          // modelsInputs[index].readOnly = true;
        }
      } else {
        // If it's not the first value, add a new row and set the value
        addRow();
        var newRowInputs = document.querySelectorAll('input[name="models[]"]');
        if (newRowInputs[index]) {
          newRowInputs[index].value = value;
          // newRowInputs[index].readOnly = true;
    newRowInputs[index].parentNode.parentNode.setAttribute('prefilled', 'true');
        }
      }
    });
  }

  if (quantityValues) {
    var quantitiesInputs = document.querySelectorAll('input[name="stepboxes[]"]');
    var values = quantityValues.split(',');
    values.forEach((value, index) => {
      if (index === 0) {
        if (quantitiesInputs[index]) {
          quantitiesInputs[index].value = value;
    	  //quantitiesInputs[index].readOnly = true;
        }
      } else {
        var newRowInputs = document.querySelectorAll('input[name="stepboxes[]"]');
        if (newRowInputs[index]) {
          newRowInputs[index].value = value;
          //newRowInputs[index].readOnly = true;
    //newRowInputs[index].parentNode.parentNode.classList.add('prefilled');
        }
      }
    });
    var artworkCheckboxes = document.querySelectorAll('input[name="discount"]');
    var checkbox = Array.from(artworkCheckboxes).find((checkbox) => checkbox.value === 'on');
    checkbox.checked = true;
    toggleCostInput(checkbox, 'addDiscount')
    document.querySelector('input[name="addDiscount"]').value = addDiscountValue;
  }

//function addInputListeners() {
//            const quantities = document.getElementsByName('quantities[]');
//            for (let i = 0; i < quantities.length; i++) {
//                quantities[i].addEventListener('input', calculateTotal);
//            }
//        }

// Add event listeners on page load
//window.onload = addInputListeners;
//document.addEventListener('DOMContentLoaded', prefillFormFromUrl);
// Call the function to prefill the form when the page loads
document.addEventListener('DOMContentLoaded', () => {
	prefillFormFromUrl();
	//calculateTotal();
	//calculatePayable();
});

const TW = Telegram.WebApp;
TW.ready();

TW.MainButton.text = 'Finish';
TW.MainButton.color = '#eb4034';
TW.MainButton.textColor = '#ffffff';

TW.MainButton.show().onClick(function () {
	var form = document.getElementById('orderForm');
  	var jsonData = new FormData(form);
  	var formData = {};
  	jsonData.forEach((value, key) => {
    	  if (!formData[key]) {
      	    formData[key] = [];
          }
    	  formData[key].push(value);
        });
        formData['formname'] = 'Ordering'
	const INVCno = getParameterByName('ORDRno');
	if (INVCno) {
		formData['ORDRno'] = INVCno;
	}
        var jsonString = JSON.stringify(formData);
        TW.sendData(jsonString);
        TW.close();
});
TW.expand();
