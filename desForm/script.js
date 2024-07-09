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

var materialsInputs = document.querySelectorAll('input[name="materials[]"]');
materialsInputs[0].parentNode.parentNode.setAttribute('prefilled', 'true');

function addRow() {
  var table = document.querySelector('table');
  var newRow = table.insertRow(table.rows.length);
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  cell1.innerHTML = '<input id="materials" type="text" name="materials[]" placeholder="child" required>';
  cell2.innerHTML = '<input id="measures" type="number" name="measures[]" placeholder="child" required>';
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
}


function goToPage(page) {
  document.getElementById('page1').style.display = page === 1 ? 'block' : 'none';
  document.getElementById('page2').style.display = page === 2 ? 'block' : 'none';
  document.getElementById('page3').style.display = page === 3 ? 'block' : 'none';
  document.getElementById('page2HB').style.display = page === 4 ? 'block' : 'none';
  document.getElementById('page2HP').style.display = page === 5 ? 'block' : 'none';
  document.getElementById('page2HE').style.display = page === 6 ? 'block' : 'none';
  document.getElementById('page2HA').style.display = page === 7 ? 'block' : 'none';
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

function toggleCostInput(checkbox, inputName, inputCash, labelID, page) {
  var costInput = document.querySelector('input[name="' + inputName + '"]');
  var cashInput = document.querySelector('input[name="' + inputCash + '"]');
  var label = document.getElementById(labelID);
  costInput.disabled = !checkbox.checked;
  cashInput.disabled = !checkbox.checked;
  if (checkbox.checked) {
    label.onclick = function() {
      goToPage(page);
    };
  } else {
    label.onclick = null;
  }
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
  var materialsValues = getParameterByName('materials');
  var measuresValues = getParameterByName('measures');
  var artworkValues = getParameterByName('artwork');
  var handBlockCost = getParameterByName('handBlockCost');
  var handPaintCost = getParameterByName('handPaintCost');
  var handEmbroideryCost = getParameterByName('handEmbroideryCost');
  var handAppliqueCost = getParameterByName('handAppliqueCost');
  var tailoringCost = getParameterByName('tailoringCost');
  var categoryValue = getParameterByName('category');
  var combinedWith = getParameterByName('combineWith');

  // Prefill values in the form
  if (materialsValues) {
    var materialsInputs = document.querySelectorAll('input[name="materials[]"]');
    var values = materialsValues.split(',');
    values.forEach((value, index) => {
      if (index === 0) {
        // If it's the first value, set it in the default row
        if (materialsInputs[index]) {
          materialsInputs[index].value = value;
          materialsInputs[index].readOnly = true;
        }
      } else {
        // If it's not the first value, add a new row and set the value
        addRow();
        var newRowInputs = document.querySelectorAll('input[name="materials[]"]');
        if (newRowInputs[index]) {
          newRowInputs[index].value = value;
          newRowInputs[index].readOnly = true;
    newRowInputs[index].parentNode.parentNode.setAttribute('prefilled', 'true');
        }
      }
    });
  }

  if (measuresValues) {
    var measuresInputs = document.querySelectorAll('input[name="measures[]"]');
    var values = measuresValues.split(',');
    values.forEach((value, index) => {
      if (index === 0) {
        if (measuresInputs[index]) {
          measuresInputs[index].value = value;
    measuresInputs[index].readOnly = true;
        }
      } else {
        var newRowInputs = document.querySelectorAll('input[name="measures[]"]');
        if (newRowInputs[index]) {
          newRowInputs[index].value = value;
          newRowInputs[index].readOnly = true;
    //newRowInputs[index].parentNode.parentNode.classList.add('prefilled');
        }
      }
    });
  }


  if (artworkValues) {
    var artworkCheckboxes = document.querySelectorAll('input[name="artwork[]"]');
    artworkValues.split(',').forEach((value) => {
      var checkbox = Array.from(artworkCheckboxes).find((checkbox) => checkbox.value === value);
      if (checkbox) {
        checkbox.checked = true;
        toggleCostInput(checkbox, value + 'Cost');
      }
    });
  }

  if (handBlockCost) {
    document.querySelector('input[name="handBlockCost"]').value = handBlockCost;
  }

  if (handPaintCost) {
    document.querySelector('input[name="handPaintCost"]').value = handPaintCost;
  }

  if (handEmbroideryCost) {
    document.querySelector('input[name="handEmbroideryCost"]').value = handEmbroideryCost;
  }

  if (handAppliqueCost) {
    document.querySelector('input[name="handAppliqueCost"]').value = handAppliqueCost;
  }

  if (tailoringCost) {
    document.querySelector('input[name="tailoringCost"]').value = tailoringCost;
  }

  if (categoryValue) {
    document.querySelector('input[name="category"]').value = categoryValue;
  }

  if (combinedWith) {
    document.querySelector('input[name="combineWith"]').value = combinedWith;
  }
}

// Call the function to prefill the form when the page loads
document.addEventListener('DOMContentLoaded', prefillFormFromUrl);

function uploadImages(user, previewID, formData) {
	var preview = document.getElementById(previewID);
	var images = preview.getElementsByTagName('img');
	var names = previewID.slice(-2)+"_names"
	var tokens = previewID.slice(-2)+"_tokens"
	formData[names] = [];
	formData[tokens] = [];
	//var tokens = [];
	//var names = [];

        for (var i = 0; i < images.length; i++) {
	    var picurl = images[i].src;
	    var now = new Date();
            var year = now.getFullYear().toString().slice(-2); // Last two digits of year
            var month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
            var day = now.getDate().toString().padStart(2, '0');
            var hour = now.getHours().toString().padStart(2, '0');
            var minute = now.getMinutes().toString().padStart(2, '0');
            var second = now.getSeconds().toString().padStart(2, '0');
            var datetimeStr = `${year}${month}${day}${hour}${minute}${second}`;
	    //var datetimeStr = new Date().toISOString().replace(/[-:.]/g, "");
	    var picname = previewID.slice(-2) + "_" + datetimeStr;
	    formData[names].push(picname);

	    const storage = getStorage();
            const storageRef = ref(storage,'user/'+user.uid+'/'+picname);
	    uploadString(storageRef, picurl, 'data_url').then((snapshot) => {
		getDownloadURL(snapshot.ref).then((downloadURL) => {
		const URLparts = downloadURL.split('token=');
		const token = URLparts.length > 1 ? URLparts[URLparts.length - 1] : null;
		formData[tokens].push(token);
		});
	    })
	    .catch((error) => {
		//uploaded = false;
		console.log({message:"Image not uploaded!\nPlease try again."});
		//Telegram.WebApp.close();
            });
        }

	return formData;
}


function previewImagesHB(event) {
	    uploadImages('previewHB');
            var preview = document.getElementById('previewHB');
            //preview.innerHTML = '';

            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();

                reader.onload = function(e) {
                    var container = document.createElement('div');
                    container.className = 'preview-container';

                    var img = document.createElement('img');
                    img.className = 'preview-image';
                    img.src = e.target.result;

                    container.addEventListener('click', function() {
                            preview.removeChild(container);
                    });
                    container.appendChild(img);
                    preview.appendChild(container);
                }

                reader.readAsDataURL(file);
            }
	    
        }

function previewImagesHP(event) {
            var preview = document.getElementById('previewHP');
            //preview.innerHTML = '';

            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();

                reader.onload = function(e) {
		    var container = document.createElement('div');
		    container.className = 'preview-container';

                    var img = document.createElement('img');
                    img.className = 'preview-image';
                    img.src = e.target.result;

		    container.addEventListener('click', function() {
			    preview.removeChild(container);
		    });
		    container.appendChild(img);
                    preview.appendChild(container);
                }

                reader.readAsDataURL(file);
            }
        }

function previewImagesHE(event) {
            var preview = document.getElementById('previewHE');
            preview.innerHTML = '';

            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();

                reader.onload = function(e) {
		    var container = document.createElement('div');
                    container.className = 'preview-container';

                    var img = document.createElement('img');
                    img.className = 'preview-image';
                    img.src = e.target.result;

                    container.addEventListener('click', function() {
                            preview.removeChild(container);
                    });
                    container.appendChild(img);
                    preview.appendChild(container);
                }

                reader.readAsDataURL(file);
            }
        }

function previewImagesHA(event) {
            var preview = document.getElementById('previewHA');
            preview.innerHTML = '';

            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();

                reader.onload = function(e) {
                    var container = document.createElement('div');
                    container.className = 'preview-container';

                    var img = document.createElement('img');
                    img.className = 'preview-image';
                    img.src = e.target.result;

                    container.addEventListener('click', function() {
                            preview.removeChild(container);
                    });
                    container.appendChild(img);
                    preview.appendChild(container);
                }

                reader.readAsDataURL(file);
            }
        }


function openFileBrowserHB(event) {
	const fileInput = document.getElementById('HBimages');
	fileInput.click();
}

function openFileBrowserHP(event) {
        const fileInput = document.getElementById('HPimages');
        fileInput.click();
}

function openFileBrowserHE(event) {
        const fileInput = document.getElementById('HEimages');
        fileInput.click();
}

function openFileBrowserHA(event) {
        const fileInput = document.getElementById('HAimages');
        fileInput.click();
}


Telegram.WebApp.ready();
Telegram.WebApp.MainButton.setText('Finish').show().onClick(function () {
	var form = document.getElementById('textileForm');
  	var jsonData = new FormData(form);
  	var formData = {};
  	jsonData.forEach((value, key) => {
    	  if (!formData[key]) {
      	    formData[key] = [];
          }
    	  formData[key].push(value);
        });
	const auth = getAuth();
	const username = 'antant.boutique@gmail.com';
	const password = 'EntEntE@2024';
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
        	const user = userCredential.user;
		var formData = uploadImages(user, 'previewHB', formData)
	}
        formData['formname'] = 'Textile Design'
        var jsonString = JSON.stringify(formData);
        Telegram.WebApp.sendData(jsonString);
        Telegram.WebApp.close();
});
Telegram.WebApp.expand();
