import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL, updateMetadata } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

let totalIMG = 0;

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

function uploadImages(user) {
    const previews = ["previewHB", "previewHP", "previewHE", "previewHA", "previewPROD"];
    //var uploadedIMG = 0;
    formData['images'] = {};
    
    if (uploadedIMG == totalIMG) {
        send_formData_to_Bot();
    } else {
    document.getElementById('loading-overlay').style.display = 'flex';
    for (var p=0; p < previews.length; p++) {
	var previewID = previews[p];
	var preview = document.getElementById(previewID);
        var images = preview.getElementsByTagName('img');
        var names = previewID.slice(7)+"_name"
        var tokens = previewID.slice(7)+"_tokens"
        //formData[names] = [];
        //formData[tokens] = [];
	//console.log(images);
	for (var i = 0; i < images.length; i++) {
	    var picurl = images[i].src;
	    var datetimeStr = new Date().toISOString().replace(/[-:.]/g, "");
	    var picname = previewID.slice(7) + "_" + datetimeStr;
	    //formData[names].push(picname);
	    const storage = getStorage();
            const storageRef = ref(storage,'user/'+user+'/'+picname+'.png');
            uploadString(storageRef, picurl, 'data_url').then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log(snapshot);
		const URLparts = downloadURL.split('token=');
                const token = URLparts.length > 1 ? URLparts[URLparts.length - 1] : null;
		formData['images'][snapshot.metadata.name] = token;
                
		uploadedIMG += 1;
		
		if (uploadedIMG == totalIMG) {
		    send_formData_to_Bot();
		}
                });
            })
            .catch((error) => {
                //uploaded = false;
                console.log({message:"Image not uploaded!\nPlease try again."});
		TW.showPopup({message:"Image not uploaded!\nPlease try again."});
                //Telegram.WebApp.close();
            });

        }}
    }
}


function previewImagesHB(event) {
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
			    totalIMG -= 1;
                    });
                    container.appendChild(img);
                    preview.appendChild(container);
		    totalIMG += 1;
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
			    totalIMG -= 1;
		    });
		    container.appendChild(img);
                    preview.appendChild(container);
		    totalIMG += 1;
                }

                reader.readAsDataURL(file);
            }
        }

function previewImagesHE(event) {
            var preview = document.getElementById('previewHE');
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
			    totalIMG -= 1;
                    });
                    container.appendChild(img);
                    preview.appendChild(container);
		    totalIMG += 1;
                }

                reader.readAsDataURL(file);
            }
        }

function previewImagesHA(event) {
            var preview = document.getElementById('previewHA');
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
			    totalIMG -= 1;
                    });
                    container.appendChild(img);
                    preview.appendChild(container);
		    totalIMG += 1;
                }

                reader.readAsDataURL(file);
            }
        }


function previewImagesPROD(event) {
            var preview = document.getElementById('previewPROD');
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
                            totalIMG -= 1;
                    });
                    container.appendChild(img);
                    preview.appendChild(container);
                    totalIMG += 1;
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

function openFileBrowserPROD(event) {
        const fileInput = document.getElementById('PRODimages');
        fileInput.click();
}

window.addRow = addRow;
window.deleteRow = deleteRow;
window.goToPage = goToPage;
window.openFileBrowserHB = openFileBrowserHB;
window.openFileBrowserHP = openFileBrowserHP;
window.openFileBrowserHE = openFileBrowserHE;
window.openFileBrowserHA = openFileBrowserHA;
window.openFileBrowserPROD = openFileBrowserPROD;
window.previewImagesHB = previewImagesHB;
window.previewImagesHP = previewImagesHP;
window.previewImagesHE = previewImagesHE;
window.previewImagesHA = previewImagesHA;
window.previewImagesPROD = previewImagesPROD;
window.toggleCostInput = toggleCostInput;

function send_formData_to_Bot() {
	formData['formname'] = 'Textile Design';
	var jsonString = JSON.stringify(formData);
	console.log(jsonString);
        TW.sendData(jsonString);
        TW.showPopup({message:"Design informations are now sent to the BOT!"});
        TW.close();
}

let uploadedIMG = 0;
let formData = {};

const TW = Telegram.WebApp;
TW.ready();
TW.enableClosingConfirmation();

TW.MainButton.text = 'Finish';
TW.MainButton.color = '#eb4034';
TW.MainButton.textColor = '#ffffff';

//Telegram.WebApp.ready();
//Telegram.WebApp.MainButton.setText('Finish').show().onClick(function () {
//TW.MainButton.show().onClick(function () {
//        TW.MainButton.hide();
//        document.getElementById('loading-overlay').style.display = 'flex';

//const finishButton = document.getElementById("finishButton");
//finishButton.addEventListener('click', function() {
TW.MainButton.show().onClick(function () {
	TW.MainButton.hide();
	//document.getElementById('loading-overlay').style.display = 'flex';
	var username = sessionStorage.getItem('username');
        var password = sessionStorage.getItem('password');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('password');
	var form = document.getElementById('textileForm');
  	var jsonData = new FormData(form);
  	//var formData = {};
	console.log(jsonData);
	const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
  	jsonData.forEach((value, key) => {
	  //console.log(value,key);
	  if (key !== "images[]") {
          	if (!formData[key]) {
            		formData[key] = [];
          	}
           	formData[key].push(value);
          }
	});
	const userid = userCredential.user.uid;
	uploadImages(userid);
	//formData['formname'] = 'Textile Design';
        //var jsonString = JSON.stringify(formData);
	/*if (uploadedIMG == 4) {
            console.log(formData);
        }*/
        //console.log(jsonString);
	})
        .catch((error) => {
                console.log("Incorrect username or password!\nSession closed!");
                TW.showPopup({message:"Incorrect username or password!\nSession closed!"});
                TW.close();
        });
        //formData['formname'] = 'Textile Design';
        //var jsonString = JSON.stringify(formData);
	//console.log(jsonString);
	//localStorage.setItem('formData', jsonString);

    	// Redirect to the authentication page
        //Telegram.WebApp.sendData(jsonString);
        //Telegram.WebApp.close();
});
TW.expand();
