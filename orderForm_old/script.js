// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL, updateMetadata } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
        apiKey: "AIzaSyDcHo4rDarasQ6vpTjtVYT0xu8T43AI4B8",
        authDomain: "test1-1e3d0.firebaseapp.com",
        projectId: "test1-1e3d0",
        storageBucket: "test1-1e3d0.appspot.com",
        messagingSenderId: "31521875447",
        appId: "1:31521875447:web:866af9b76ad347441ffaf2",
        measurementId: "G-C2WHYVRCSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
  cell2.innerHTML = '<label class="rounded-checkbox"><input type="checkbox" name="stepboxes[]" id="stepboxes" value="off"></label>';
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

	const totalAmountValue = parseFloat(getParameterByName('totalAmount')) || 0;
	const payableAmountValue = parseFloat(getParameterByName('payableAmount')) || 0;

	let paid = totalAmountValue-payableAmountValue;

	if (checkbox.checked && paid<0.5) {
		const discount = parseFloat(document.getElementById('discount').value) || 0;
		payable -= payable*(discount/100);
		document.getElementById('payable').value = Math.round(payable).toFixed(2);
	}
}

// Function to prefill entries from URL
function prefillFormFromUrl() {
  // Get values from URL parameters
  var customerName = getParameterByName('customerName');
  var customerContact = getParameterByName('customerContact');
  var customerAddress = getParameterByName('customerAddress');
  var modelValues = getParameterByName('models');
  var quantityValues = getParameterByName('quantities');
  var accessoriesValue = getParameterByName('accessories');
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
    var quantitiesInputs = document.querySelectorAll('input[name="quantities[]"]');
    var values = quantityValues.split(',');
    values.forEach((value, index) => {
      if (index === 0) {
        if (quantitiesInputs[index]) {
          quantitiesInputs[index].value = value;
    	  //quantitiesInputs[index].readOnly = true;
        }
      } else {
        var newRowInputs = document.querySelectorAll('input[name="quantities[]"]');
        if (newRowInputs[index]) {
          newRowInputs[index].value = value;
          //newRowInputs[index].readOnly = true;
    //newRowInputs[index].parentNode.parentNode.classList.add('prefilled');
        }
      }
    });
  }

  if (accessoriesValue) {
	document.getElementById('accText').value = accessoriesValue;
  }

  if (totalAmountValue) {
        document.getElementById('total').value = totalAmountValue;
        document.getElementById('total-container').style.display = 'block';
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
	document.getElementById('pay-container').style.display = 'block';
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
	// Overwrite stepboxes manually to ensure true/false values
    	var checkboxes = document.querySelectorAll('input[name="stepboxes[]"]');
    	formData["stepboxes[]"] = Array.from(checkboxes).map(cb => cb.checked);
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
