function register(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    var cpassword = document.getElementById("cpassword").value;

    if (!name.trim()) {
        alert("Name is required");
        return;
    } else if (password !== cpassword) {
        alert("Passwords should be identical");
        return;
    }

    var userData = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };
    
    localStorage.setItem("userData", JSON.stringify(userData));
    
    localStorage.setItem("isLoggedIn", "true"); 

    alert(name + " Registered Successfully. Redirecting to Post App.");
    window.location.href = "dashboard.html"; 
}

function login(event) {
    event.preventDefault();

    var loginEmail = document.getElementById("loginEmail").value;
    var loginPass = document.getElementById("loginPass").value;

    var storedData = JSON.parse(localStorage.getItem("userData"));

    if (!storedData) {
        alert("No user registered. Please Sign Up first.");
        return;
    }

    if (storedData.email !== loginEmail) {
        alert("Invalid Email");
    } else if (storedData.password !== loginPass) {
        alert("Invalid Password");
    } else {
        
        localStorage.setItem("isLoggedIn", "true"); 
        
        alert("Login Successful. Redirecting to Post App.");
        window.location.href = "dashboard.html";
    }
}

function logout() {
    
    localStorage.removeItem("isLoggedIn");
    
    alert("Logged Out Successfully.");
    window.location.href = "index.html"; 
}

function renderUserData() {
    var storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
        var displayData = document.getElementById("displayData");
        if(displayData) {
             displayData.innerHTML = `
                <li class="list-group-item">Name: <strong>${storedData.name}</strong></li>
                <li class="list-group-item">Email: <strong>${storedData.email}</strong></li>
                <li class="list-group-item">Phone: <strong>${storedData.phone}</strong></li>
            `;
        }
    }
}

function register(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    var cpassword = document.getElementById("cpassword").value;

    if (password !== cpassword) {
        alert("Passwords do not match!");
        return;
    }

    var userData = { name, email, phone, password };
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");

    alert("Account Created! Moving to Dashboard...");
    window.location.href = "dashboard.html";
}

function login(event) {
    event.preventDefault();
    var loginEmail = document.getElementById("loginEmail").value;
    var loginPass = document.getElementById("loginPass").value;

    var storedData = JSON.parse(localStorage.getItem("userData"));

    if (storedData && storedData.email === loginEmail && storedData.password === loginPass) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Credentials! Please try again.");
    }
}