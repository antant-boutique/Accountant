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

function toggleCostInput(checkbox, inputName) {
  var costInput = document.querySelector('input[name="' + inputName + '"]');
  costInput.disabled = !checkbox.checked;
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


function previewImagesHB(event) {
            var preview = document.getElementById('previewHB');
	    console.log(preview);
            //preview.innerHTML = '';
	    console.log(preview);

            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();

                reader.onload = function(e) {
                    var img = document.createElement('img');
		    img.addEventListener('click', function() {
			preview.removeChild(img);
		    }
		    )
                    img.className = 'preview-image';
                    img.src = e.target.result;
                    preview.appendChild(img);
                }

                reader.readAsDataURL(file);
            }
        }

function previewImagesHP(event) {
            var preview = document.getElementById('previewHP');
            preview.innerHTML = '';

            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();

                reader.onload = function(e) {
                    var img = document.createElement('img');
                    img.className = 'preview-image';
                    img.src = e.target.result;
                    preview.appendChild(img);
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
                    var img = document.createElement('img');
                    img.className = 'preview-image';
                    img.src = e.target.result;
                    preview.appendChild(img);
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
                    var img = document.createElement('img');
                    img.className = 'preview-image';
                    img.src = e.target.result;
                    preview.appendChild(img);
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
        formData['formname'] = 'Textile Design'
        var jsonString = JSON.stringify(formData);
        Telegram.WebApp.sendData(jsonString);
        Telegram.WebApp.close();
});
Telegram.WebApp.expand();
