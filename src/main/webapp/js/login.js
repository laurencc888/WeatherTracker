document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // check if passwords match
    if (username !== localStorage.getItem(username)) {
        alert("This user does not exist.");
        return;
    }
	
    // sending the request to the server
    try {
        const response = await fetch("http://localhost:8080/laurencc_CSCI201_Assignment3/LoginServlet", {
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
            alert("Successful login!");
			localStorage.setItem("logged", 1);
			localStorage.setItem("currUser", username);
            window.location.href = "index.html"; // redirect to the home page
        }
		
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});
