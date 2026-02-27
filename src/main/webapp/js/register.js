document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();

    // check if passwords match
    if (password !== confirm) {
        alert("The passwords do not match.");
        return;
    }
	
    // sending the request to the server
    try {
        const response = await fetch("http://localhost:8080/laurencc_CSCI201_Assignment3/RegisterServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, pass: password }),
        });
		
        if (!response.ok) {
            const error = await response.json();
            alert(error);
        } else {
            // if successful
            alert("Successfully created a new account!");
			localStorage.setItem(username, username);
			localStorage.setItem("logged", 1);
			localStorage.setItem("currUser", username);
			// console.log(localStorage.getItem("username"));
            window.location.href = "index.html"; // redirect to the home page
        }
		
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});
