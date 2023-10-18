//Testing js with two methods
function webNote() {
    alert("This website is to schedule on a calendar!");
}

function callNote() {
    return webNote();
}

//logging in 
//document.querySelector('#loginButton').addEventListener('click', login)

document.getElementById("loginButton").onclick = function () {
    location.replace("https://www.w3schools.com");
}
function login() {
    //let login = document.getElementById("loginButton");
    //location.href = "/index.html";
    location.replace("index.html")
    //<a href="index.html"></a>

}

//Account verification for different username and password

function check() {

}