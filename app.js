// ================================
// RESUME MAKER APP - AUTH LOGIC
// HACKATHON / ASSIGNMENT READY
// ================================

// ---------- HELPERS ----------
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ---------- DARK MODE LOGIC ----------
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    var isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark);
    updateDarkModeButtons(isDark);
}

function applyDarkMode() {
    var isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
        document.body.classList.add("dark-mode");
    }
    updateDarkModeButtons(isDark);
}

function updateDarkModeButtons(isDark) {
    var buttons = document.querySelectorAll("button[onclick='toggleDarkMode()']");
    buttons.forEach(function (btn) {
        btn.textContent = isDark ? "Light Mode" : "Dark Mode";
        btn.className = isDark ? "btn btn-outline-warning me-2" : "btn btn-outline-light me-2";
    });
}

// Apply on load
document.addEventListener("DOMContentLoaded", applyDarkMode);

// ---------- SEARCH LOGIC ----------
function searchResumes(query) {
    var filter = query.toUpperCase();
    var containers = document.querySelectorAll(".resume-container");

    containers.forEach(function (container) {
        var text = container.innerText || container.textContent;
        if (text.toUpperCase().indexOf(filter) > -1) {
            container.style.display = "";
        } else {
            container.style.display = "none";
        }
    });
}


function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function setLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

function logout() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully");
    window.location.href = "index.html";
}

// ---------- SIGNUP ----------
function register(event) {
    event.preventDefault();

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var password = document.getElementById("password").value;
    var cpassword = document.getElementById("cpassword").value;

    if (!name || !email || !phone || !password || !cpassword) {
        alert("All fields are required");
        return;
    }

    if (password !== cpassword) {
        alert("Passwords do not match");
        return;
    }

    var users = getUsers();

    // Email unique check
    var emailExists = users.some(function (user) {
        return user.email === email;
    });

    if (emailExists) {
        alert("Email already registered");
        return;
    }

    var newUser = {
        id: Date.now(), // unique id
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    users.push(newUser);
    saveUsers(users);

    setLoggedInUser({
        id: newUser.id,
        email: newUser.email
    });

    alert("Signup successful");
    window.location.href = "dashboard.html";
}

// ---------- LOGIN ----------
function login(event) {
    event.preventDefault();

    var loginEmail = document.getElementById("loginEmail").value.trim();
    var loginPass = document.getElementById("loginPass").value;

    var users = getUsers();

    var user = users.find(function (u) {
        return u.email === loginEmail && u.password === loginPass;
    });

    if (!user) {
        alert("Invalid email or password");
        return;
    }

    setLoggedInUser({
        id: user.id,
        email: user.email
    });

    alert("Login successful");
    window.location.href = "dashboard.html";
}

// ---------- PROTECTED ROUTES ----------
function protectPage() {
    var loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("Please login first");
        window.location.href = "index.html";
    }
}

// ---------- DASHBOARD USER INFO ----------
function renderUserData() {
    var loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    var users = getUsers();
    var user = users.find(function (u) {
        return u.id === loggedInUser.id;
    });

    var displayData = document.getElementById("displayData");
    if (user && displayData) {
        displayData.innerHTML = `
            <li class="list-group-item">Name: <strong>${user.name}</strong></li>
            <li class="list-group-item">Email: <strong>${user.email}</strong></li>
            <li class="list-group-item">Phone: <strong>${user.phone}</strong></li>
        `;
    }
}

// ---------- RESUME STORAGE BASE (NEXT MODULE READY) ----------


// ---------- RESUME STORAGE HELPERS ----------
function getResumes() {
    return JSON.parse(localStorage.getItem("resumes")) || [];
}

function saveResumes(resumes) {
    localStorage.setItem("resumes", JSON.stringify(resumes));
}

// ---------- SAVE RESUME LOGIC ----------
function saveResume(event) {

    event.preventDefault();

    var loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    var currentId = document.getElementById("resEmail").getAttribute("data-id");

    var resume = {
        id: currentId ? parseInt(currentId) : Date.now(),
        userId: loggedInUser.id,
        template: document.querySelector('input[name="template"]:checked').value, // Capture selected template
        fullName: document.getElementById("fullName").value.trim(),
        jobTitle: document.getElementById("jobTitle").value.trim(),
        email: document.getElementById("resEmail").value.trim(),
        phone: document.getElementById("resPhone").value.trim(),
        address: document.getElementById("resAddress").value.trim(),
        summary: document.getElementById("resSummary").value.trim(),
        education: {
            degree: document.getElementById("eduDegree").value.trim(),
            school: document.getElementById("eduSchool").value.trim(),
            year: document.getElementById("eduYear").value.trim()
        },
        experience: {
            company: document.getElementById("expCompany").value.trim(),
            role: document.getElementById("expRole").value.trim(),
            duration: document.getElementById("expDuration").value.trim(),
            description: document.getElementById("expDesc").value.trim()
        },
        skills: document.getElementById("resSkills").value.trim().split(",").map(function (s) { return s.trim(); })
    };

    var resumes = getResumes();

    if (currentId) {
        // Update existing
        var index = resumes.findIndex(function (r) { return r.id == currentId; });
        if (index !== -1) {
            resumes[index] = resume;
        }
    } else {
        // Create new
        resumes.push(resume);
    }

    saveResumes(resumes);

    alert("Resume saved successfully!");
    window.location.href = "dashboard.html"; // Redirect to dashboard as requested
}

// ---------- RENDER RESUMES (PREVIEW) ----------
function renderResumes() {
    var loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    var resumes = getResumes();
    var userResumes = resumes.filter(function (r) {
        return r.userId === loggedInUser.id;
    });

    var container = document.getElementById("resumesList");
    if (!container) return;

    if (userResumes.length === 0) {
        container.innerHTML = '<div class="alert alert-info text-center">No resumes found. <a href="resume-form.html">Create one now!</a></div>';
        return;
    }

    container.innerHTML = "";

    userResumes.forEach(function (resume) {
        var skillsHtml = resume.skills.map(function (skill) {
            return '<span class="badge bg-secondary me-1">' + skill + '</span>';
        }).join("");

        var templateClass = resume.template || "template-classic"; // Default to classic

        var html = `
            <div class="resume-container position-relative ${templateClass}" id="resume-${resume.id}">
                <div class="position-absolute top-0 end-0 p-3 no-print">
                    <button class="btn btn-sm btn-success me-1" onclick="downloadResume(${resume.id})">Download PDF</button>
                    <button class="btn btn-sm btn-warning me-1" onclick="editResume(${resume.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteResume(${resume.id})">Delete</button>
                </div>

                <div class="resume-header text-center">
                    <h1 class="fw-bold text-primary">${resume.fullName}</h1>
                    <p class="lead">${resume.jobTitle}</p>
                    <p class="small text-muted">
                        ${resume.email} | ${resume.phone} | ${resume.address}
                    </p>
                </div>

                <div class="resume-section">
                    <h5 class="section-title">Profile Summary</h5>
                    <p>${resume.summary}</p>
                </div>

                <div class="resume-section">
                    <h5 class="section-title">Education</h5>
                    <p><strong>${resume.education.degree}</strong> - ${resume.education.school} <span class="text-muted">(${resume.education.year})</span></p>
                </div>

                <div class="resume-section">
                    <h5 class="section-title">Experience</h5>
                    <p><strong>${resume.experience.role}</strong> at ${resume.experience.company}</p>
                    <p class="text-muted small">${resume.experience.duration}</p>
                    <p>${resume.experience.description}</p>
                </div>

                <div class="resume-section">
                    <h5 class="section-title">Skills</h5>
                    <div class="mb-2">${skillsHtml}</div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function downloadResume(id) {
    // Hide all other resumes, show only this one then print
    var allResumes = document.querySelectorAll('.resume-container');
    allResumes.forEach(function (el) { el.style.display = 'none'; });

    var targetResume = document.getElementById("resume-" + id);
    if (targetResume) {
        targetResume.style.display = 'block';
        window.print();

        // Restore
        allResumes.forEach(function (el) { el.style.display = 'block'; });
    }
}

function deleteResume(id) {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    var resumes = getResumes();
    var updatedResumes = resumes.filter(function (r) { return r.id !== id; });
    saveResumes(updatedResumes);
    renderResumes();
}

// ---------- EDIT RESUME LOGIC ----------
function editResume(id) {
    window.location.href = "resume-form.html?id=" + id;
}

// Check if we are on resume-form.html and need to load data
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("resume-form.html")) {
        var params = new URLSearchParams(window.location.search);
        var id = params.get("id");
        if (id) {
            loadResumeForEdit(id);
        }
    }
});

function loadResumeForEdit(id) {
    var resumes = getResumes();
    var resume = resumes.find(function (r) { return r.id == id; });

    if (resume) {
        document.getElementById("fullName").value = resume.fullName;
        document.getElementById("jobTitle").value = resume.jobTitle;
        document.getElementById("resEmail").value = resume.email;
        document.getElementById("resPhone").value = resume.phone;
        document.getElementById("resAddress").value = resume.address;
        document.getElementById("resSummary").value = resume.summary;

        document.getElementById("eduDegree").value = resume.education.degree;
        document.getElementById("eduSchool").value = resume.education.school;
        document.getElementById("eduYear").value = resume.education.year;

        document.getElementById("expCompany").value = resume.experience.company;
        document.getElementById("expRole").value = resume.experience.role;
        document.getElementById("expDuration").value = resume.experience.duration;
        document.getElementById("expDesc").value = resume.experience.description;

        document.getElementById("resSkills").value = resume.skills.join(", ");

        // Store ID in a hidden way or global var to know we are updating
        document.getElementById("resEmail").setAttribute("data-id", id);

        // Select template
        if (resume.template) {
            var radioButton = document.querySelector('input[name="template"][value="' + resume.template + '"]');
            if (radioButton) radioButton.checked = true;
        }
    }
}
