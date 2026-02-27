// checking if user is logged in 
const loggedIn = localStorage.getItem("logged");

if (loggedIn == 1) {
    const header = document.querySelector("header");
    header.innerHTML = `
        <a href="profile.html">Profile</a>
        <a href="index.html" id="signOut">Sign Out</a>
    `;
	
	// if the user logs out from here
    document.getElementById("signOut").addEventListener("click", function () {
        localStorage.setItem("logged", 0);
		window.location.href = "index.html"; // redirect to the home page
    });
}

async function load(){
	const username = localStorage.getItem("currUser"); // Get the current username from localStorage
	    const table = document.querySelector("#searchTable tbody");
	    const usernameDisplay = document.getElementById("usernameDisplay");

	    usernameDisplay.textContent = `${username}'s Search History`;

	    try {
			// only 1 parameter so no need for gson tbh
	        const response = await fetch(`http://localhost:8080/laurencc_CSCI201_Assignment3/WeatherServlet?username=${encodeURIComponent(username)}`);
	        
	        if (!response.ok) {
				const error = await response.json();
				alert(error);
	            return;
	        }

			// getting the data
	        const data = await response.json();

	        // resetting table
			let rowsHTML = `
			        <thead>
			            <tr>
			            </tr>
			        </thead>
			        <tbody>
			    `;
			// syntax taken from w3schools
		    // looping through each city and displaying data as necessary
		    data.forEach((query) => {
		        rowsHTML += `
		            <tr>
		                <td>${query}</td>
		            </tr>
		        `;
		    });
		    table.innerHTML = rowsHTML;
			
			if (data.length > 1) {
		       table.style.display = "block";
			} 
	   		else {
		       table.style.display = "none";
		    }
			
		} 
		catch (error) {
		    console.error("Error loading search history:", error);
		}
}

document.addEventListener("DOMContentLoaded", load());