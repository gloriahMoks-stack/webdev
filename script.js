
// 1. VARIABLES


let members = [];
const MIN_PASSWORD_LENGTH = 8;

// 2. GET REFERENCES TO HTML ELEMENTS
// Get the registration form
const regForm = document.getElementById("regform");

// Get every input, select and textarea inside the form
const formFields = document.querySelectorAll(
    "#regform input, #regform select, #regform textarea"
);

// Get every error message element
const errorElements = document.querySelectorAll(".error");

// Get the success message box
const successMessage = document.getElementById("successMsg");

// Get the member list
const memberList = document.getElementById("memberList");

// Get the member counter
const memberCounter = document.getElementById("count");

// Get the dark mode button
const darkModeButton = document.getElementById("theme");

// 3. LOG ELEMENTS TO THE CONSOLE

console.log("Registration Form:", regForm);
console.log("Form Fields:", formFields);
console.log("Error Elements:", errorElements);
console.log("Success Message:", successMessage);
console.log("Member List:", memberList);
console.log("Member Counter:", memberCounter);
console.log("Dark Mode Button:", darkModeButton);

// 4. MAP EACH FIELD TO ITS ERROR ELEMENT

const errorMap = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
    "confirm-password": document.getElementById("confirmError"),
    gender: document.getElementById("genderError"),
    dob: document.getElementById("dobError"),
    country: document.getElementById("countryError"),
    phone: document.getElementById("phoneError"),
    bio: document.getElementById("bioError")
};

// 5. HELPER FUNCTION TO SHOW AN ERROR

function showError(field, message) {
    const errorElement = errorMap[field.id];

    if (errorElement) {
        errorElement.textContent = message;
    }

    field.classList.add("invalid");
}

// 6. HELPER FUNCTION TO CLEAR AN ERROR

function clearError(field) {
    const errorElement = errorMap[field.id];

    if (errorElement) {
        errorElement.textContent = "";
    }

    field.classList.remove("invalid");
}

// 7. VALIDATE EACH FIELD

function validateField(field) {
    const value = field.value.trim();

    // Clear the previous error before validating again
    clearError(field);

    // Check whether the field is empty
    if (value === "") {
        showError(field, "This field is required.");
        return false;
    }

    // Validate the full name
    if (field.id === "name") {
        if (value.length < 2) {
            showError(field, "Name must contain at least 2 characters.");
            return false;
        }
    }

    // Validate the email
    if (field.id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            showError(field, "Please enter a valid email address.");
            return false;
        }
    }

    // Validate the password
    if (field.id === "password") {
        if (field.value.length < MIN_PASSWORD_LENGTH) {
            showError(
                field,
                `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
            );
            return false;
        }
    }

    // Validate the confirm-password field
    if (field.id === "confirm-password") {
        const password = document.getElementById("password").value;

        if (field.value !== password) {
            showError(field, "Passwords do not match.");
            return false;
        }
    }

    // Validate the date of birth
    if (field.id === "dob") {
        const selectedDate = new Date(value);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(selectedDate.getTime())) {
            showError(field, "Please enter a valid date.");
            return false;
        }

        if (selectedDate > today) {
            showError(field, "Date of birth cannot be in the future.");
            return false;
        }
    }

    // Validate the phone number
    if (field.id === "phone") {
        const phonePattern = /^\+?[\d\s()-]{7,20}$/;

        if (!phonePattern.test(value)) {
            showError(field, "Please enter a valid phone number.");
            return false;
        }

        const digitCount = value.replace(/\D/g, "").length;

        if (digitCount < 7 || digitCount > 15) {
            showError(field, "Phone number must contain 7–15 digits.");
            return false;
        }
    }

    // Validate the biography
    if (field.id === "bio") {
        if (value.length < 10) {
            showError(field, "Bio must contain at least 10 characters.");
            return false;
        }
    }

    return true;
}

// 8. CLEAR ERRORS AS THE USER TYPES

formFields.forEach(function (field) {

    field.addEventListener("input", function () {
        validateField(field);

        // If the password changes, check the confirmation again
        if (field.id === "password") {
            const confirmPassword =
                document.getElementById("confirm-password");

            if (confirmPassword.value !== "") {
                validateField(confirmPassword);
            }
        }
    });

    // Also handle dropdown selections and date changes
    field.addEventListener("change", function () {
        validateField(field);
    });

});

// 9. UPDATE THE MEMBER COUNTER

function updateMemberCounter() {
    memberCounter.textContent = members.length;
}

// 10. REGISTER A NEW MEMBER
function registerMember(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Hide the previous success message
    successMessage.classList.add("hidden");
    successMessage.textContent = "";

    // Validate every field
    let formIsValid = true;

    formFields.forEach(function (field) {

        const isValid = validateField(field);

        if (!isValid) {
            formIsValid = false;
        }

    });

    // Stop registration if any field is invalid
    if (!formIsValid) {
        return;
    }

    // Collect the member's information
    const member = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        gender: document.getElementById("gender").value,
        dob: document.getElementById("dob").value,
        country: document.getElementById("country").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        bio: document.getElementById("bio").value.trim()
    };

    // Save the member in our array
    members.push(member);

    // Remove the "No members yet" message
    const emptyNote = document.getElementById("emptyNote");

    if (emptyNote) {
        emptyNote.remove();
    }

    // Create the member's list item
    const listItem = document.createElement("li");

    listItem.className = "member-item";

    // Create the member information container
    const info = document.createElement("div");

    info.className = "info";

    // Create the member's name
    const nameElement = document.createElement("strong");

    nameElement.textContent = member.name;

    // Create the member's email
    const emailElement = document.createElement("span");

    emailElement.textContent = member.email;

    // Add the name and email to the information container
    info.appendChild(nameElement);
    info.appendChild(document.createElement("br"));
    info.appendChild(emailElement);

    // Create a remove button
    const removeButton = document.createElement("button");

    removeButton.type = "button";
    removeButton.className = "remove";
    removeButton.textContent = "Remove";

    // Store the member's information on the list item
    listItem.memberData = member;

    // Handle removal of this member
    removeButton.addEventListener("click", function () {

        // Remove this member from the array
        members = members.filter(function (savedMember) {
            return savedMember !== listItem.memberData;
        });

        // Remove the list item from the page
        listItem.remove();

        // Update the counter
        updateMemberCounter();

        // Display the empty message if no members remain
        if (members.length === 0) {
            showEmptyMessage();
        }

    });

    // Add the information and button to the list item
    listItem.appendChild(info);
    listItem.appendChild(removeButton);

    // Add the new member to the page
    memberList.appendChild(listItem);

    // Update the counter
    updateMemberCounter();

    // Display the success message
    successMessage.textContent =
        `Success! ${member.name} has been registered.`;

    successMessage.classList.remove("hidden");

    // Reset the form
    regForm.reset();

    // Clear all error messages and invalid styles
    formFields.forEach(function (field) {
        clearError(field);
    });

}

// 11. SHOW THE EMPTY MEMBER LIST MESSAGE

function showEmptyMessage() {

    // Do not create duplicate empty messages
    if (document.getElementById("emptyNote")) {
        return;
    }

    const emptyNote = document.createElement("li");

    emptyNote.className = "empty";
    emptyNote.id = "emptyNote";

    emptyNote.textContent =
        "No members yet. Register someone to begin.";

    memberList.appendChild(emptyNote);

}

// 12. LISTEN FOR FORM SUBMISSION
regForm.addEventListener("submit", registerMember);

// 13. DARK MODE TOGGLE
darkModeButton.addEventListener("click", function () {

    // Toggle the "dark" class defined in your CSS
    document.body.classList.toggle("dark");

    // Update the button label
    if (document.body.classList.contains("dark")) {
        darkModeButton.textContent = "Light Mode";
    } else {
        darkModeButton.textContent = "Dark Mode";
    }

});

// 14. INITIALIZE THE MEMBER COUNTER
updateMemberCounter();