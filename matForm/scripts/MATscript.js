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

// Global variables
var currentPage = 0;					// current Page number
var form = document.getElementById('materialForm');	// material form
var formData = {};					// form data storage
var isFirstSet = true;					// controls back button visibility
var uid = 'none';
var username = 'none';
var password = 'none';

if (sessionStorage.getItem('authenticated') == 'true') {
        //uid = sessionStorage.getItem('uid');
        //sessionStorage.removeItem('uid');
	username = sessionStorage.getItem('username');
	password = sessionStorage.getItem('password');
	sessionStorage.removeItem('username');
	sessionStorage.removeItem('password');
} else {
        window.location.href = 'index.html';
}

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

// Get Parameters by name
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Function to populate form fields with URL parameter values
function populateFormFields() {
	var urlParams = getURLParameters();
	var inputFields = document.querySelectorAll('input[name]');
	console.log(inputFields)
	var inputImage = document.getElementById('preview');
	const MATcdn = getParameterByName('matcdn');
	inputFields.forEach(function(inputField) {
		var key = inputField.name;
		var values = urlParams[key];
		if (values && values.length > 0) {
			if (key != 'picture') {
				inputField.value = values[0];
				if (MATcdn) {
					inputField.readOnly = true;
				}
			} else {
				inputField.src = values[0];
				inputImage.src = values[0];
			}
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
		console.log(name);
		console.log(value);
		if (value == '' && (name != "picture" && name != "prepic")) {
			formIsEmpty = true;
		}
		console.log(formIsEmpty);
	});
	return formIsEmpty;
}

function readImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = function(event) {
			resolve(event.target.result);
    		};
    		reader.onerror = function(error) {
      			reject(error);
    		};
    		reader.readAsDataURL(file);
  	});
}


// A function to move to Previous set of inputs when the back button is pressed
function moveToPreviousSet() {
	var inputFields = document.querySelectorAll('input[data-values]');
	var inputImage = document.getElementById('preview');
	var formIsEmpty = checkIfEmpty();
	console.log(inputFields);
	//currentPage = currentPage - 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
                        var value = inputImage.src.toLowerCase().startsWith("http") ? '#' : inputImage.src;
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
	console.log(inputFields);
	//currentPage = currentPage + 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
			var value = inputImage.src.toLowerCase().startsWith("http") ? '#' : inputImage.src;
			console.log(value);
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
const prepic = document.getElementById('prepic');
var pic_inputField = document.querySelectorAll('input[name="picture"][data-values]');
var touchStarted = false;

pictureInput.addEventListener('change', function() {
	const file = this.files[0];
	console.log(file);
	if (file) {
		readImage(file)
    		.then((dataURL) => {
			console.log(dataURL);
			previewImage.src = dataURL;
			previewImage.style.display = 'block';
			const filePath = pictureInput.value;
			const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
			prepic.value = fileName;
		})
		.catch((error) => {
                        previewImage.src = '#';
			previewImage.style.display = 'none';
			pictureInput.src = '#';
			pictureInput.value = '';
			const filePath = pictureInput.value;
			const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
			prepic.value = fileName;
                });

	} else {
		console.log('else triggered!')
		previewImage.src = '#';
		previewImage.style.display = 'none';
		pictureInput.src = '#';
		pictureInput.value = '';
		const filePath = pictureInput.value;
                const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
		prepic.value = fileName;
	}

});



document.getElementById('backButton').addEventListener('click', function () {
	moveToPreviousSet();
	console.log(formData);
});

document.getElementById('nextButton').addEventListener('click', function () {
        moveToNextSet();
	console.log(formData);
});

window.onload = populateFormFields;


const TW = Telegram.WebApp;
TW.ready();
TW.enableClosingConfirmation();

TW.MainButton.text = 'Finish';
TW.MainButton.color = '#eb4034';
TW.MainButton.textColor = '#ffffff';

TW.MainButton.show().onClick(function () {
	moveToNextSet();
	TW.MainButton.hide();
	document.getElementById('loading-overlay').style.display = 'flex';
        formData['formname'] = 'Material Entry';
	const MATcdn = getParameterByName('matcdn');
        if (MATcdn) {
                formData['matcdn'] = MATcdn;
        }
        //var jsonString = JSON.stringify(formData);
	//console.log(jsonString)i
	if (formData.price === undefined) {
		//const entryLength = formData.price.length;
		TW.showPopup({message:"Session terminated!"});
                TW.close();
	}
	const entryLength = formData.price.length;
	//TW.showPopup({message:"Session terminated!"});
        //TW.close();
	//const storage = getStorage();
	//var uploaded = false;
	const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
	const user = userCredential.user;
	var count = 0;
	for (let i = 0; i < entryLength; i++) {
                /*for (let key in formData) {
                        if (key=='picture') {
                                formData[key][i] = '';
                        }
                }*/
		const picname = formData['prepic'][i];
		//const storageRef = ref(storage,'user/'+user.uid+'/'+picname);
		const picurl = formData['picture'][i];
		console.log(picurl);
		if (picurl != '#' && picurl != '') {
			const storage = getStorage();
			const storageRef = ref(storage,'user/'+user.uid+'/'+picname);
			uploadString(storageRef, picurl, 'data_url').then((snapshot) => {
				//const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				//console.log('Upload is ' + progress + '% done');
				getDownloadURL(snapshot.ref).then((downloadURL) => {
				const URLparts = downloadURL.split('token=');
				const token = URLparts.length > 1 ? URLparts[URLparts.length - 1] : null;
				formData['picture'][i] = token;
				count = count + 1;
				if (count == entryLength) {
                		var jsonString = JSON.stringify(formData);
                		TW.sendData(jsonString);
				TW.showPopup({message:"Materials informations are now sent to the BOT!"});
                		TW.close();
                		};
				});
			})
			.catch((error) => {
				//uploaded = false;
				TW.showPopup({message:"Image not uploaded!\nPlease try again."});
				//Telegram.WebApp.close();
			});
		} else {
			count = count + 1;
			if (count == entryLength) {
			var jsonString = JSON.stringify(formData);
			TW.sendData(jsonString);
			TW.showPopup({message:"Materials informations are now sent to the BOT!"});
                        TW.close();
			};
		};
        };
	})
	.catch((error) => {
                TW.showPopup({message:"Incorrect username or password!\nSession terminated!"});
                TW.close();
        });

});
TW.expand();

