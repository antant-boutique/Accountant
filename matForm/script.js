// Global variables
var currentPage = 0;					// current Page number
var form = document.getElementById('materialForm');	// material form
var formData = {};					// form data storage
var isFirstSet = true;					// controls back button visibility


// Function to extract URL parameters
function getURLParameters() {
	var params = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		params[key] = params[key] || [];
		params[key].push(decodeURIComponent(value));
		console.log(params[key]);
	});
	return params;
}

// Function to populate form fields with URL parameter values
function populateFormFields() {
	var urlParams = getURLParameters();
	var inputFields = document.querySelectorAll('input[name]');
	inputFields.forEach(function(inputField) {
		var key = inputField.name;
		var values = urlParams[key];
		if (values && values.length > 0) {
			inputField.value = values[0];
		} else {
  			inputField.value = '';
		}
		inputField.setAttribute('data-values', JSON.stringify(values || []));
	});
}

// Check if any of the input fields is empty
function checkIfEmpty() {
	var formIsEmpty = false;
	var inputFields = document.querySelectorAll('input[data-values]');
	inputFields.forEach(function (inputField) {
		let name = inputField.name;
                let value = inputField.value;
		if (value == '' && name != 'picture') {
			formIsEmpty = true;
		}
	});
	return formIsEmpty;
}

// A function to move to Previous set of inputs when the back button is pressed
function moveToPreviousSet() {
	var inputFields = document.querySelectorAll('input[data-values]');
	var formIsEmpty = checkIfEmpty()
	//currentPage = currentPage - 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		var value = inputField.value;
		var currentValue = inputField.value;
		if (formData.hasOwnProperty(key)) {
			var valueIndex = formData[key].indexOf(currentValue);
			if (valueIndex > 0 || valueIndex == -1) {
				try {
				inputField.value = formData[key][currentPage-1];
				} catch(err) {
				inputField.value = '';
				}
				if (!formIsEmpty) {
            			if (currentPage == formData[key].length){
                			formData[key].push(value);
                		} else {
					formData[key][currentPage] = value;
				}
				}
				isFirstSet = false;
          		}
        	}
      	});
	currentPage = currentPage - 1;
	if (currentPage == 0) {
		isFirstSet = true;
	}
      	// Hide the Back button if we are on the first set of entries
      	document.getElementById('backButton').style.display = isFirstSet ? 'none' : 'block';
}

// A function to move to next set of inputs when the next button is pressed
function moveToNextSet() {
	var formIsEmpty = checkIfEmpty()
	if (!formIsEmpty) {
	var inputFields = document.querySelectorAll('input[data-values]');
	//currentPage = currentPage + 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		var value = inputField.value;
		if (!formData.hasOwnProperty(key)) {
          		formData[key] = [];
        	}
        	if (currentPage == formData[key].length){
          		formData[key].push(value);
        	} else {
          		formData[key][currentPage] = value;
          	}
        	var values = JSON.parse(inputField.getAttribute('data-values'));
        	var currentIndex = values.indexOf(value);
		if (values.length > 0 && currentPage+1 < values.length) {
			if (currentPage+1 == formData[key].length) {
				inputField.value = values[currentPage+1] || '';
			} else {
				inputField.value = formData[key][currentPage+1];
			}
		} else {
			if (currentPage+1 == formData[key].length) {
				inputField.value = '';
                        } else {
				inputField.value = formData[key][currentPage+1];
                        }
		}
	});
	currentPage = currentPage+1;
	const previewImage = document.getElementById('preview');
	previewImage.src = '#';
	previewImage.style.display = 'none';
	document.getElementById('backButton').style.display = 'block';
	}
}

// Image input handling
const pictureInput = document.getElementById('picture');
const previewImage = document.getElementById('preview');
var touchStarted = false;

pictureInput.addEventListener('change', function() {
	const file = this.files[0];
	if (file) {
		const reader = new FileReader();
		reader.addEventListener('load', function() {
			previewImage.src = reader.result;
			previewImage.style.display = 'block';
		});

		reader.readAsDataURL(file);
	} else {
		previewImage.src = '#';
		previewImage.style.display = 'none';
	}
});


// Touch event listeners for mobile devices
pictureInput.addEventListener('touchstart', function(event) {
	touchStarted = true;
	event.stopPropagation();
});

pictureInput.addEventListener('touchend', function(event) {
	if (touchStarted) {
		event.preventDefault();
		touchStarted = false;
		const clickEvent = new MouseEvent('click');
        	pictureInput.dispatchEvent(clickEvent);
      	}
});

// Toggle the clicked class on image input click
const imageInput = document.querySelector('.image-input');
imageInput.addEventListener('click', function(event) {
	const target = event.target;
	if (target.tagName === 'DIV' || target.tagName === 'INPUT') {
		pictureInput.click();
	}
});

document.getElementById('backButton').addEventListener('click', function () {
	moveToPreviousSet();
});

document.getElementById('nextButton').addEventListener('click', function () {
        moveToNextSet();
});

window.onload = populateFormFields;

Telegram.WebApp.ready();
Telegram.WebApp.MainButton.setText('Next').show().onClick(function () {
	var jsonString = JSON.stringify(formData);
        Telegram.WebApp.sendData(jsonString);
        Telegram.WebApp.close();
});
Telegram.WebApp.expand();
