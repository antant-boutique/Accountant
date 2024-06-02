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
	var inputImage = document.getElementById('preview');
	var formIsEmpty = checkIfEmpty();
	//currentPage = currentPage - 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
                        var value = inputImage.src;
                } else {
                        var value = inputField.value;
                }
		var currentValue = inputField.value;
		if (formData.hasOwnProperty(key)) {
			var valueIndex = formData[key].indexOf(currentValue);
			if (valueIndex > 0 || valueIndex == -1) {
				try {
				if (inputField.name == 'picture') {
					inputImage.src = formData[key][currentPage-1];
				} else {
					inputField.value = formData[key][currentPage-1];
				}
				} catch(err) {
				if (inputField.name == 'picture') {
                                        inputImage.src = '#';
                                } else {
					inputField.value = '';
				}
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
	const previewImage = document.getElementById('preview');
        const previewImageVal = formData['picture'][currentPage];
        if (previewImageVal === undefined || previewImageVal == '#' || previewImageVal == '') {
                previewImage.style.display = 'none';
        } else {
                previewImage.style.display = 'block';
        }
      	// Hide the Back button if we are on the first set of entries
      	document.getElementById('backButton').style.display = isFirstSet ? 'none' : 'flex';
}

// A function to move to next set of inputs when the next button is pressed
function moveToNextSet() {
	var formIsEmpty = checkIfEmpty();
	if (!formIsEmpty) {
	var inputFields = document.querySelectorAll('input[data-values]');
	var inputImage = document.getElementById('preview');
	//currentPage = currentPage + 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
			var value = inputImage.src;
		} else {
			var value = inputField.value;
		}
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
				if (inputField.name == 'picture') {
					inputImage.src = values[currentPage+1] || '#';
				} else {
					inputField.value = values[currentPage+1] || '';
				}
			} else {
				if (inputField.name == 'picture') {
                                        inputImage.src = formData[key][currentPage+1];
                                } else {
					inputField.value = formData[key][currentPage+1];
				}
			}
		} else {
			if (currentPage+1 == formData[key].length) {
				if (inputField.name == 'picture') {
                                        inputImage.src = '#';
                                } else {
					inputField.value = '';
				}
                        } else {
				if (inputField.name == 'picture') {
                                        inputImage.src = formData[key][currentPage+1];
                                } else {
					inputField.value = formData[key][currentPage+1];
				}
                        }
		}
	});
	currentPage = currentPage+1;
	const previewImage = document.getElementById('preview');
	const previewImageVal = formData['picture'][currentPage];
	if (previewImageVal === undefined || previewImageVal == '#' || previewImageVal == '') {
		previewImage.style.display = 'none';
	} else {
		previewImage.style.display = 'block';
	}
	document.getElementById('backButton').style.display = 'flex';
	}
}

// Image input handling
const pictureInput = document.getElementById('picture');
const previewImage = document.getElementById('preview');
var pic_inputField = document.querySelectorAll('input[name="picture"][data-values]');
var touchStarted = false;

pictureInput.addEventListener('change', function() {
	const file = this.files[0];
	if (file) {
		const reader = new FileReader();
		reader.addEventListener('load', function() {
			previewImage.src = reader.result;
			previewImage.style.display = 'block';
			//pictureInput.src = reader.result;
                        //pictureInput.style.display = 'block';
		});

		reader.readAsDataURL(file);
	} else {
		previewImage.src = '#';
		previewImage.style.display = 'none';
		pictureInput.src = '';
                //pictureInput.style.display = 'none';
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

function byteLength(str) {
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code <= 0x7f) {
            // 1-byte sequence (0xxxxxxx)
            continue;
        } else if (code <= 0x7ff) {
            // 2-byte sequence (110xxxxx 10xxxxxx)
            s++;
        } else if (code >= 0xdc00 && code <= 0xdfff) {
            // Trail surrogate
            continue;
        } else if (code >= 0xd800 && code <= 0xdbff) {
            // Lead surrogate (110110xx xxxxxxxx) (110111xx xxxxxxxx)
            s++;
            i--;
        } else {
            // 3-byte sequence (1110xxxx 10xxxxxx 10xxxxxx)
            s += 2;
        }
    }
    return s;
}

// Toggle the clicked class on image input click
const imageInput = document.querySelector('.image-input');
imageInput.addEventListener('click', function(event) {
	const target = event.target;
	if (target.tagName === 'DIV' || target.tagName === 'INPUT') {
		pictureInput.click();
	}
});

const firebaseConfig = {
	apiKey: "AIzaSyAg88g_vPnxNHawTE4BYQ5yGVjueSjaHrk",
	authDomain: "antant-core-0.firebaseapp.com",
	projectId: "antant-core-0",
	storageBucket: "antant-core-0.appspot.com",
	messagingSenderId: "488893001711",
	appId: "1:488893001711:web:5e701f2f8247e260ba501a",
	measurementId: "G-PK48RPZY7S"
};

firebase.initializeApp(firebaseConfig);
console.log(firebase);

document.getElementById('backButton').addEventListener('click', function () {
	moveToPreviousSet();
	console.log(formData.price.length);
});

document.getElementById('nextButton').addEventListener('click', function () {
        moveToNextSet();
	console.log(formData.price.length);
	const entryLength = formData.price.length;
        for (let i = 0; i < entryLength; i++) {
                let dataPack = {};
                for (let key in formData) {
                        if (formData.hasOwnProperty(key)) {
                        	dataPack[key] = [formData[key][i]];
                        }
                }
                dataPack['formname'] = 'Material Entry';
                var jsonString = JSON.stringify(dataPack);
                var strLength = byteLength(jsonString);
                console.log(strLength);
                //Telegram.WebApp.sendData(jsonString);
        }
	/*const entryLength = formData.price.length;
	for (let i = 0; i < entryLength; i++) {
                let dataPack = {};
                for (let key in formData) {
                        if (formData.hasOwnProperty(key)) {
                                dataPack[key] = [formData[key][i]];
                        }
                }
                dataPack['formname'] = 'Material Entry';
		var jsonString = JSON.stringify(dataPack);
		console.log(jsonString)
	}*/
});

window.onload = populateFormFields;

<<<<<<< HEAD
=======
function byteLength(str) {
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code <= 0x7f) {
            // 1-byte sequence (0xxxxxxx)
            continue;
        } else if (code <= 0x7ff) {
            // 2-byte sequence (110xxxxx 10xxxxxx)
            s++;
        } else if (code >= 0xdc00 && code <= 0xdfff) {
            // Trail surrogate
            continue;
        } else if (code >= 0xd800 && code <= 0xdbff) {
            // Lead surrogate (110110xx xxxxxxxx) (110111xx xxxxxxxx)
            s++;
            i--;
        } else {
            // 3-byte sequence (1110xxxx 10xxxxxx 10xxxxxx)
            s += 2;
        }
    }
    return s;
}

function sendDataToServer(data) {
    fetch('https://31cb-49-37-35-54.ngrok-free.app/submit', { // Replace <YOUR_PUBLIC_IP> with your public IP address
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

>>>>>>> 7a5cd9a9b58ccb008e004bdc3c58a28c870304ed

Telegram.WebApp.ready();
Telegram.WebApp.MainButton.setText('Finish').show().onClick(function () {
	moveToNextSet();
	const entryLength = formData.price.length;
	for (let i = 0; i < entryLength; i++) {
    		let dataPack = {};
    		for (let key in formData) {
        		if (formData.hasOwnProperty(key)) {
				dataPack[key] = [formData[key][i]];
        		}
    		}
		dataPack['formname'] = 'Material Entry';
    		var jsonString = JSON.stringify(dataPack);
		var strLength = byteLength(jsonString);
		console.log(strLength);
		sendDataToServer(jsonString);
	}
	Telegram.WebApp.sendData('OK');
	Telegram.WebApp.close();
	//var jsonString = JSON.stringify(formData);
        //Telegram.WebApp.sendData(jsonString);
        //Telegram.WebApp.close();
});
Telegram.WebApp.expand();
