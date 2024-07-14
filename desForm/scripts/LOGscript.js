/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);*/

var passwordInput = document.getElementById("password");
var themeToggle = document.getElementById("theme-toggle");

function uploadImages(user, previewID, formData) {
        var preview = document.getElementById(previewID);
        var images = preview.getElementsByTagName('img');
        var tokens = previewID.slice(-2)+"_token"
        var name = formData[previewID.slice(-2)+"_name"];
	var srcs = formData[previewID.slice(-2)+"_srcs"];
        //var tokens = [];
        //var names = [];

        for (var i = 0; i < name.length; i++) {
            var picurl = srcs[i];
            var picname = name[i];

            const storage = getStorage();
            const storageRef = ref(storage,'user/'+user.uid+'/'+picname);
            uploadString(storageRef, picurl, 'data_url').then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                const URLparts = downloadURL.split('token=');
                const token = URLparts.length > 1 ? URLparts[URLparts.length - 1] : null;
                formData[srcs][i] = token;
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

function toggleTheme() {
	if (document.body.classList.contains("dark-mode")) {
        	document.body.classList.remove("dark-mode");
        	themeToggle.classList.remove("sun");
        	themeToggle.classList.add("moon");
        	passwordInput.type = "password";
      } else {
        	document.body.classList.add("dark-mode");
        	themeToggle.classList.remove("moon");
        	themeToggle.classList.add("sun");
        	passwordInput.type = "text";
      }

      // Trigger focus on the password input field
      passwordInput.focus();
}

const themeButton = document.getElementById("theme-toggle");
themeButton.addEventListener('click', function() {
        toggleTheme();
});

const TW = Telegram.WebApp;
TW.ready();

TW.MainButton.text = 'Login';
TW.MainButton.color = '#222222';
TW.MainButton.textColor = '#ffffff';

window.onload = function() {
    if (window.opener && window.opener.formData) {
        formData = window.opener.formData;
    }
}

//const loginButton = document.getElementById("loginButton");
//loginButton.addEventListener('click', function() {
TW.MainButton.show().onClick(function () {
	var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

	sessionStorage.setItem('username',username);
        sessionStorage.setItem('password',password);
	window.location.href = 'desform.html';

});

