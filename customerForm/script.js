var modelsInputs = document.querySelectorAll('input[name="models[]"]');
modelsInputs[0].parentNode.parentNode.setAttribute('prefilled', 'true');

function addRow() {
  var table = document.querySelector('table');
  var newRow = table.insertRow(table.rows.length);
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  cell1.innerHTML = '<input type="text" name="models[]" required>';
  //cell2.innerHTML = '<input type="number" name="quantities[]" required oninput="calculateTotal()">';
  cell2.innerHTML = '<input type="number" name="quantities[]" required>';
  cell1.parentNode.parentNode.setAttribute('prefilled', 'false');
}

// Function to delete a row from the table
function deleteRow(button) {
  var table = document.querySelector('table');
  var rowIndex = table.rows.length - 1;
  var row = table.rows[rowIndex];

  // Check if the row is prefilled
  if (row.getAttribute('prefilled') !== 'true') {
    table.deleteRow(rowIndex);
  }
  //calculateTotal();
}


function goToPage(page) {
  document.getElementById('page1').style.display = page === 1 ? 'block' : 'none';
  document.getElementById('page2').style.display = page === 2 ? 'block' : 'none';
  document.getElementById('page3').style.display = page === 3 ? 'block' : 'none';
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

function calculateTotal() {
	const quantities = document.querySelectorAll('input[name="quantities[]"]');
	let total = 0;

	for (let i = 0; i < quantities.length; i++) {
		const value = parseFloat(quantities[i].value) || 0;
		total += value;
	}

	document.getElementById('total').value = total.toFixed(2);
}

function calculatePayable() {
	const total = parseFloat(document.getElementById('total').value);
	const checkboxes = document.querySelectorAll('input[name="discount"]');
	var checkbox = Array.from(checkboxes).find((checkbox) => checkbox.value === 'on');
	let payable = total;

	console.log(checkbox.checked);

	if (checkbox.checked) {
		const discount = parseFloat(document.getElementById('discount').value) || 0;
		payable -= payable*(discount/100);
	}

	document.getElementById('payable').value = Math.round(payable).toFixed(2);
}

// Function to prefill entries from URL
function prefillFormFromUrl() {
  // Get values from URL parameters
  var customerName = getParameterByName('customerName');
  var customerContact = getParameterByName('customerContact');
  var customerAddress = getParameterByName('customerAddress');
  var modelValues = getParameterByName('models');
  var quantityValues = getParameterByName('quantities');
  var artworkValues = getParameterByName('artwork');
  var totalAmountValue = getParameterByName('totalAmount');
  var addDiscountValue = getParameterByName('addDiscount');
  var payableAmountValue = getParameterByName('payableAmount');
  var paidAmountValue = getParameterByName('paidAmount');
  var fullpaidOption = getParameterByName('fullpaid');
  var upiQRpayment = getParameterByName('upiQR');

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
          modelsInputs[index].readOnly = true;
        }
      } else {
        // If it's not the first value, add a new row and set the value
        addRow();
        var newRowInputs = document.querySelectorAll('input[name="models[]"]');
        if (newRowInputs[index]) {
          newRowInputs[index].value = value;
          newRowInputs[index].readOnly = true;
    newRowInputs[index].parentNode.parentNode.setAttribute('prefilled', 'true');
        }
      }
    });
  }

  if (quantityValues) {
    var quantitiesInputs = document.querySelectorAll('input[name="quantities[]"]');
    var values = quantityValues.split(',');
    values.forEach((value, index) => {
      if (index === 0) {
        if (quantitiesInputs[index]) {
          quantitiesInputs[index].value = value;
    	  quantitiesInputs[index].readOnly = true;
        }
      } else {
        var newRowInputs = document.querySelectorAll('input[name="quantities[]"]');
        if (newRowInputs[index]) {
          newRowInputs[index].value = value;
          newRowInputs[index].readOnly = true;
    //newRowInputs[index].parentNode.parentNode.classList.add('prefilled');
        }
      }
    });
  }

  if (totalAmountValue) {
        document.getElementById('total').value = totalAmountValue;
        document.getElementById('pay-container').style.display = 'flex';
  }

  if (addDiscountValue) {
    var artworkCheckboxes = document.querySelectorAll('input[name="discount"]');
    var checkbox = Array.from(artworkCheckboxes).find((checkbox) => checkbox.value === 'on');
    checkbox.checked = true;
    toggleCostInput(checkbox, 'addDiscount')
    document.querySelector('input[name="addDiscount"]').value = addDiscountValue;
  }

  if (payableAmountValue) {
	document.getElementById('payable').value = payableAmountValue;
	document.getElementById('pay-container').style.display = 'flex';
  }

  if (paidAmountValue) {
	document.querySelector('input[name="paidAmount"]').value = paidAmountValue;
  }

  if (fullpaidOption) {
  	var artworkCheckboxes = document.querySelectorAll('input[name="fullpaid"]');
	var checkbox = Array.from(artworkCheckboxes).find((checkbox) => checkbox.value === 'on');
	checkbox.checked = true;
  }

  if (upiQRpayment) {
        var artworkCheckboxes = document.querySelectorAll('input[name="upiQR"]');
        var checkbox = Array.from(artworkCheckboxes).find((checkbox) => checkbox.value === 'on');
        checkbox.checked = true;
  }

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

Telegram.WebApp.ready();
Telegram.WebApp.MainButton.setText('Finish').show().onClick(function () {
	var form = document.getElementById('billingForm');
  	var jsonData = new FormData(form);
  	var formData = {};
  	jsonData.forEach((value, key) => {
    	  if (!formData[key]) {
      	    formData[key] = [];
          }
    	  formData[key].push(value);
        });
        formData['formname'] = 'Billing'
        var jsonString = JSON.stringify(formData);
        Telegram.WebApp.sendData(jsonString);
        Telegram.WebApp.close();
});
Telegram.WebApp.expand();
