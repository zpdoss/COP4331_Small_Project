const urlBase = 'http://cop4331-small-project-t16.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


function validLoginForm(logName, logPass) {

    var logNameErr = logPassErr = true;

    if (logName == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
		// code below requires 3-18 characters, one letter, allows number, and allows special characters
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_!@#$%^&*()+=.,?~`|]{3,18}$/;

        if (regex.test(logName) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            logNameErr = false;
        }
    }

    if (logPass == "") {
        console.log("PASSWORD IS BLANK");
        logPassErr = true;
    }
    else {
		// code below requires 8-32 characters, one number, one letter, one special character
        //var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

		// code below requires 3-18 characters, one letter, allows number, and allows special characters
		var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_!@#$%^&*()+=.,?~`|]{3,18}$/;

        if (regex.test(logPass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            logPassErr = false;
        }
    }

    if ((logNameErr || logPassErr) == true) {
        return false;
    }
    return true;

}

function validSignUpForm(fName, lName, user, pass) {

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
		// code below requires 3-18 characters, one letter, allows number, and allows special characters
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_!@#$%^&*()+=.,?~`|]{3,18}$/;

        if (regex.test(user) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            userErr = false;
        }
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
		// code below requires 8-32 characters, one number, one letter, one special character
        //var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

		// code below requires 3-18 characters, one letter, allows number, and allows special characters
		var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_!@#$%^&*()+=.,?~`|]{3,18}$/;

        if (regex.test(pass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passErr = false;
        }
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;

    }

    return true;
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("login").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	var hash = md5(password);
    if (!validLoginForm(login, password)) {
        document.getElementById("loginResult").innerHTML = "invalid username or password";
        return;
    }

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

                // Save user data to local storage
                localStorage.setItem('userId', userId);

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignup() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!validSignUpForm(firstName, lastName, username, password)) {
        document.getElementById("signupResult").innerHTML = "invalid signup";
        return;
    }

    var hash = md5(password);

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: password
    };

    let jsonPayload = JSON.stringify(tmp);

	// Log the payload to the console
    console.log("Payload being sent:", jsonPayload);

    let url = urlBase + '/SignUp.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

			// Log the server response for debugging
			console.log("Server response:", xhr.responseText);

			let jsonObject = JSON.parse(xhr.responseText);

            if (jsonObject.error === "duplicate login") {
                document.getElementById("signupResult").innerHTML = "User already exists";
                return;
            }

            else if (this.status === 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("signupResult").innerHTML = "User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function validAddContact(firstName, lastName, phone, email) {

    var fNameErr = lNameErr = phoneErr = emailErr = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (phone == "") {
        console.log("PHONE IS BLANK");
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
        }

        else {

            console.log("PHONE IS VALID");
            phoneErr = false;
        }
    }

    if (email == "") {
        console.log("EMAIL IS BLANK");
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("EMAIL IS NOT VALID");
        }

        else {

            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }

    if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
        return false;

    }

    return true;

}

function addContact() {
    // Retrieve user data from local storage
    let userId = localStorage.getItem('userId');

    // Get input values
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let name = document.getElementById("firstName").value + " " + document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    // Assuming userId is defined globally or set elsewhere in your code
    console.log("User Id is: " + userId);

    // Validate input fields
    if (!validAddContact(firstName, lastName, phone, email)) {
        console.log("INVALID NAME, PHONE, OR EMAIL SUBMITTED");
        return;
    }

    // Prepare payload
    let tmp = {
        name: name,
        phone: phone,
        email: email,
        userID: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                if (response.error) {
                    console.log("Error: " + response.error);
                } else {
                    console.log("Contact has been added");

                    // Close the modal
                    document.getElementById("modal-toggle").checked = false;

                    // Reload contacts table and switch view to show
                    loadContacts();
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }

}

function loadContacts() {
    // Retrieve user data from local storage
    let userId = localStorage.getItem('userId');
    
    if (!userId) {
        console.log("No user ID found.");
        return;
    }

    // Prepare payload
    let tmp = {
        userID: userId,
        search: ""  // Empty search query to load all contacts
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;  // Assuming you have an endpoint for fetching contacts

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                if (response.error) {
                    console.log("Error: " + response.error);
                    showTable(response.results);
                } else {
                    // Pass the results to showTable
                    showTable(response.results);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}


function showTable(contacts) {
    let userId = localStorage.getItem('userId');

    let tblBody = document.getElementById("tblBody");
    tblBody.innerHTML = "";  // Clear existing table rows

    if (contacts.length === 0) {
        // If no contacts found, display a message
        let noResultsMessage = document.createElement("div");
        noResultsMessage.className = "no-results"; // You can style this in CSS
        noResultsMessage.textContent = "No contacts found.";
        tblBody.appendChild(noResultsMessage);
    }
    else{
    contacts.forEach(contact => {
        
        let row = document.createElement("div");
        row.classList.add("rows");

        let firstNameCol = document.createElement("div");
        firstNameCol.classList.add("col", "firstName");
        firstNameCol.textContent = contact.Name.split(" ")[0];  // Assuming the first part is the first name

        let lastNameCol = document.createElement("div");
        lastNameCol.classList.add("col", "lastName");
        lastNameCol.textContent = contact.Name.split(" ")[1] || "";  // Assuming the second part is the last name

        let phoneCol = document.createElement("div");
        phoneCol.classList.add("col", "phone");
        phoneCol.textContent = contact.Phone;

        let emailCol = document.createElement("div");
        emailCol.classList.add("col", "email");
        emailCol.textContent = contact.Email;


        // Create Edit button
        let editButton = document.createElement("button");
        editButton.classList.add("col", "action-button");
        editButton.textContent = "Edit";

        editButton.onclick = function() {
                if (editButton.textContent === "Edit") {
                    // Turn the text into editable fields
                    firstNameCol.innerHTML = `<input type="text" value="${firstNameCol.textContent}" />`;
                    lastNameCol.innerHTML = `<input type="text" value="${lastNameCol.textContent}" />`;
                    phoneCol.innerHTML = `<input type="text" value="${phoneCol.textContent}" />`;
                    emailCol.innerHTML = `<input type="text" value="${emailCol.textContent}" />`;
                    editButton.textContent = "Done";
                } else {
                    // Save changes
                    let newName = `${firstNameCol.querySelector('input').value} ${lastNameCol.querySelector('input').value}`;
                    let newPhone = phoneCol.querySelector('input').value;
                    let newEmail = emailCol.querySelector('input').value;

                    // Update the database
                    updateContact(contact.ID, newName, newPhone, newEmail);

                    // Update the UI
                    firstNameCol.textContent = newName.split(" ")[0];
                    lastNameCol.textContent = newName.split(" ")[1] || "";
                    phoneCol.textContent = newPhone;
                    emailCol.textContent = newEmail;
                    editButton.textContent = "Edit";
                }
            };

        // Create Delete button
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("col", "action-button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-name", contact.Name);  // Store the name in a data attribute
        deleteButton.setAttribute("data-user-id", userId);  // Store the user ID in a data attribute

        // Add click event listener to the delete button
        deleteButton.onclick = function() {
            let nameToDelete = this.getAttribute("data-name");
            let userIdToDelete = this.getAttribute("data-user-id");

            let confirmation = confirm(`Are you sure you want to delete the contact: ${nameToDelete}?`);
            if (confirmation) {
                console.log(`Delete button clicked for: ${nameToDelete}, UserID: ${userIdToDelete}`);
                deleteContact(nameToDelete, userIdToDelete);
            }
            else {
                console.log(`Delete cancelled for: ${nameToDelete}`);
            }
        };

        row.appendChild(firstNameCol);
        row.appendChild(lastNameCol);
        row.appendChild(phoneCol);
        row.appendChild(emailCol);
        row.appendChild(editButton);
        row.appendChild(deleteButton);

        tblBody.appendChild(row);
    });
    }
}

function deleteContact(name, userId) {
    let payload = {
        userID: userId,
        name: name
    };
    let jsonPayload = JSON.stringify(payload);

    let url = urlBase + '/RemoveContacts.' + extension;  // Adjust the endpoint as necessary
    console.log(`Sending delete request for: ${name}, UserID: ${userId}`);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                console.log("Contact has been deleted");
                loadContacts();
            }
            else{
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function performSearch() {
    // Retrieve user data from local storage
    let userId = localStorage.getItem('userId');
    let searchQuery = document.getElementById('Search').value; // Get the search query
    
    if (!userId) {
        console.log("No user ID found.");
        return;
    }

    // Prepare payload with the search query
    let tmp = {
        userID: userId,
        search: searchQuery // Use the current value of the search input
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension; // Ensure this is your correct endpoint

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                if (response.error) {
                    console.log("Error: " + response.error);
                    showTable(response.results);
                } else {
                    // Pass the results to showTable
                    showTable(response.results);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}
// code for api to only search for name
//$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? AND (Name like ?)");

function updateContact(id, newName, newPhone, newEmail) {
    let payload = {
        newName: newName,
        newPhone: newPhone,
        newEmail: newEmail,
        ID: id
    };

    let jsonPayload = JSON.stringify(payload);
    let url = urlBase + '/EditContact.php'; // Ensure this URL is correct

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            if (response.error) {
                console.log("Error: " + response.error);
            } else {
                console.log("Successfully updated contact");
            }
        }
    };
    xhr.send(jsonPayload);
}

// Existing loadContacts function can remain as it is
