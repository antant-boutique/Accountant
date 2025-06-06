body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f7f7f7;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 80%;
  max-width: 600px;
}
h2 {
  color: #333;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  justify-content: center;
}
table, th, td {
  border: 1px solid #ddd;
}
th, td {
  padding: 10px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
.checkbox-container {
  margin-bottom: 10px;
  border-radius: 5px;
}
.btn-container {
  text-align: center;
  display: flex;
  justify-content: center; /* Center the buttons horizontally */
  margin-top: 20px;
}
.btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin: 0 5px;
}


#models, #quantities {
  /*width: 165px;*/
  width: 98%;
  border: none;
  border-bottom: 2px solid black;
  outline: none;
}

#backButton, #nextButton, #addRowButton, #rmvRowButton {
        display: flex;
        width: 40px;
        height: 40px;
        font-size: 20px;
        font-weight: bold;
        /* background-color: #ccccff; */
        /* background-color: #cbb89d; */
        background-color: white;
        color: black;
        border: 2px solid black;
        padding: 10px 10px;
        border-radius: 50%;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        user-select: none;
}

#nextButton {
	margin-right: 10px;
	margin-left: auto;
	margin-bottom: 20px;
}

#backButton {
	margin-left: 10px;
	margin-right: auto;
	margin-bottom: 20px;
}

#addRowButton {
	margin-right: 20px;
}

#rmvRowButton {
	margin-right: 20px;
}

.rounded-checkbox-container {
      display: flex;
      align-items: center;
      margin-top: 10px;
      user-select: none;
}

.rounded-checkbox {
      position: relative;
}

.rounded-checkbox input[type="checkbox"] {
      display: flex;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #333;
      outline: none;
      cursor: pointer;
      position: relative; /* Added position relative for the ::before and ::after elements */
      user-select: none;
}

/* Style for the inner circle when checked */
.rounded-checkbox input[type="checkbox"]:checked::after {
      content: '';
      position: absolute;
      width: 10px; /* Adjust the size of the inner circle */
      height: 10px; /* Adjust the size of the inner circle */
      background-color: red;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      user-select: none;
}

#customerName, #customerContact, #customerAddress {
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 50%;
  border: none;
  border-bottom: 2px solid black;
  outline: none;
}

#inputCost, #discount {
  margin-left: 10px;
  margin-right: 10px;
  width: 50%;
  border: none;
  border-bottom: 2px solid black;
  outline: none;
}

#inputText, #accText {
  margin-left: 10px;
  margin-right: 10px;
  width: 50%;
  border: none;
  border-bottom: 2px solid black;
  outline: none;
}

#checkLabel {
  margin-left: 10px;
  margin-right: 10px;
  user-select: none;
}

#checkMODE {
  margin-left: 10px;
  margin-right: 50px;
  user-select: none;
}

.input-label {
  margin-top: 10px;
  margin-bottom: 10px;
}

#total-container, #pay-container {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  display: none;
}

#total, #payable {
  margin-top: 20px;
  margin-left: 10px;
  border: none;
  user-select: none;
}


/* Mobile responsiveness */
/*
@media screen and (max-width: 600px) {
  .form-container {
    width: 100%;
  }
  .btn {
    width: 100%;
    margin: 5px 0;
  }
  table {
    width: 90%;
  }
}
*/


/* Mobile responsiveness */
@media screen and (max-width: 600px) {
  .form-container {
    width: 100%;
    overflow-x: auto; /* Enable horizontal scrolling if needed */
    padding: 0 10px; /* Adjust left and right padding for equal spacing */
  }

  table {
    width: 100%;
  }

  th, td {
    padding: 8px; /* Adjust padding for smaller screens */
  }

  th {
    font-size: 14px; /* Adjust font size for header cells */
  }

  td {
    font-size: 12px; /* Adjust font size for data cells */
  }

  .btn {
    width: 100%;
    margin: 5px 0;
  }
}

