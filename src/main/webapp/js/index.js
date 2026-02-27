// toggling search bar containers based on radio button selected
const cityRadio = document.getElementById("cityOption");
const latLongRadio = document.getElementById("latLongOption");
const cityContainer = document.getElementById("cityContainer");
const latLongContainer = document.getElementById("latlong-Container");
const magIcon = document.getElementById("magIcon");
const mapIcon = document.getElementById("mapIcon");

let map;

// toggle container visibilities
function toggleContainers() {
    if (cityRadio.checked) {
        cityContainer.style.display = "flex"; // toggle city container on
        latLongContainer.style.display = "none"; 
		magIcon.style.display = "flex";
		mapIcon.style.display = "none";
    } else if (latLongRadio.checked) {
        cityContainer.style.display = "none"; 
        latLongContainer.style.display = "flex"; // toggle lat/long container on
		magIcon.style.display = "none";
		mapIcon.style.display = "flex";
    }
}

cityRadio.addEventListener("click", toggleContainers);
latLongRadio.addEventListener("click", toggleContainers);


// displaying the google map 
const mapOverlay = document.getElementById("mapOverlay");
const mapElement = document.getElementById("googleMap");

function dispMap() {
    const latitudeInput = document.getElementById("latitudeInput");
    const longitudeInput = document.getElementById("longitudeInput");
	
	document.getElementById("detailsContainer").style.display = "none";

    if (!map) {
        map = new google.maps.Map(mapElement, {
            center: { lat: 29.7604, lng: -95.3698 }, // default to Houston
            zoom: 10,
        });
    }

    var latitude = parseFloat(latitudeInput.value.trim());
    var longitude = parseFloat(longitudeInput.value.trim());

    map.setCenter({ lat: latitude, lng: longitude });
    mapOverlay.style.display = "flex";
    
    // attach click listener every time the map is displayed
	// lots taken from Google API
    google.maps.event.clearListeners(map, "click");
    map.addListener("click", (mapsMouseEvent) => {
        const newLat = mapsMouseEvent.latLng.lat();
        const newLong = mapsMouseEvent.latLng.lng();

        latitudeInput.value = newLat.toFixed(4);
        longitudeInput.value = newLong.toFixed(4);
        
        mapOverlay.style.display = "none";
		if (document.getElementById("location").textContent !== "Location")
			document.getElementById("detailsContainer").style.display = "grid";
    });
}
mapIcon.addEventListener("click", dispMap);

// checking if user is logged in 
var loggedIn = localStorage.getItem("logged");

if (loggedIn == 1) {
    const header = document.querySelector("header");
    header.innerHTML = `
        <a href="profile.html">Profile</a>
        <a href="index.html" id="signOut">Sign Out</a>
    `;
	
	// if the user logs out from here
    document.getElementById("signOut").addEventListener("click", function () {
		document.getElementById("latitudeInput").value = "";
		document.getElementById("longitudeInput").value = "";
		document.getElementById("cityContainer").value = "";
		localStorage.setItem("currUser", "");
        localStorage.setItem("logged", 0);
        location.reload();
    });
}

if (loggedIn == 0) {
	document.getElementById("loginButton").addEventListener("click", function () {
		document.getElementById("latitudeInput").value = "";
		document.getElementById("longitudeInput").value = "";
		document.getElementById("cityContainer").value = "";
	});
}


// getting weather data from search
let citiesData = []; // global variable that will be used to hold weather information
async function getWeatherbyCity(city) {
	const cityURL = 'http://api.openweathermap.org/data/2.5/find?q=' + city + '&limit=5&units=imperial&appid=TOKEN';
    const response = await fetch(cityURL);

    if (response.ok) {
        return await response.json();
    } 
	else {
        console.error("Failed to fetch weather data:", response.statusText);
        return null;
    }
}

async function getWeatherbyCoords(latitude, longitude) {
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=TOKEN';
	const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    } 
	else {
        console.error("Failed to fetch weather data:", response.statusText);
        return null;
    }
}

function displayWeatherData(citiesData) {
    const citiesTable = document.getElementById("citiesTable");
	const sortMenu = document.getElementById("sortMenu");

    // making table header
    let tableHTML = `
        <thead>
            <tr>
                <th>City Name</th>
                <th>Temp. Low</th>
                <th>Temp. High</th>
            </tr>
        </thead>
        <tbody>
    `;

	// syntax taken from w3schools
    // looping through each city and displaying data as necessary
    citiesData.forEach((data, index) => {
        const cityName = data.name;
        const tempLow = data.main.temp_min;
        const tempHigh = data.main.temp_max;

        // adding each city's data as a row in the table, no decimals necessary according to example (page 7)
        tableHTML += `
            <tr>
                <td><a href="#" class="city-option" data-index="${index}">${cityName}</a></td>
                <td>${tempLow.toFixed(0)}</td>
                <td>${tempHigh.toFixed(0)}</td>
            </tr>
        `;
    });

    tableHTML += "</tbody>";
    citiesTable.innerHTML = tableHTML;

	// sort by menu will appear depending on the number of cities displayed
	if (citiesData.length > 1) {
       sortMenu.style.display = "block";
   } 
   else {
       sortMenu.style.display = "none";
   }
   
    document.getElementById("searchContainer").style.display = "block";
    document.getElementById("logo").style.display = "none";
	
	// "iterate through links in table", <1 line>, <openai.com>
	// making each city option an interactable choice
    document.querySelectorAll(".city-option").forEach((option) => {
        option.addEventListener("click", (event) => {
            event.preventDefault(); 
			
			// getting city index
			// "iterate through links in table", <1 line>, <openai.com>
            const cityIndex = event.target.dataset.index; 
            const cityData = citiesData[cityIndex];
			document.getElementById("searchContainer").style.display = "none";
            showLiveDetails(cityData);
        });
		option.style.textDecoration = "none";
		option.style.color = "#ffffff";
    });
}


async function showSearches() {
	var city = document.getElementById("cityContainer").value.trim();
    var latitude = document.getElementById("latitudeInput").value.trim();
    var longitude = document.getElementById("longitudeInput").value.trim();
    const citiesTable = document.getElementById("citiesTable");

    citiesTable.innerHTML = ""; 
	citiesData = [];

    try {
        // getting weather data using input
		// if city radio is used
        if (city && cityRadio.checked) {
			// add to profile
			loggedIn = localStorage.getItem("logged");
			if (loggedIn) {
				// sending the request to the server
			    try {
					let username = localStorage.getItem("currUser");
					let searchQuery = city;
					
			        const response = await fetch("http://localhost:8080/laurencc_CSCI201_Assignment3/WeatherServlet", {
			            method: "POST",
			            headers: {
			                "Content-Type": "application/json",
			            },
			            body: JSON.stringify({ username, query: searchQuery }),
			        });
					
			        if (!response.ok) {
			            const error = await response.json();
			            alert(error);
			        }
			    } catch (error) {
			        alert("An error occurred: " + error.message);
			    }
			}
            const cities = await getWeatherbyCity(city);

			// making sure there are valid cities
            if (!cities || cities.length === 0) {
                alert("No matching cities available.");
				document.getElementById("searchContainer").style.display = "none";
                return;
            }

            // getting weather data for each city by iterating through cities array
            for (const cityInfo of cities.list) {
                //const weatherData = await getWeatherbyCoords(cityInfo.coord.lat, cityInfo.coord.lon);
                if (cityInfo) 
					citiesData.push(cityInfo);
            }
        } 
		
		// if lat/long radio is used
		else if (latitude && longitude && latLongRadio.checked) {
			loggedIn = localStorage.getItem("logged");
			if (loggedIn) {
				// sending the request to the server
			    try {
					let username = localStorage.getItem("currUser");
					let searchQuery = "lat=" + latitude + ", lon=" + longitude;
					
			        const response = await fetch("http://localhost:8080/laurencc_CSCI201_Assignment3/WeatherServlet", {
			            method: "POST",
			            headers: {
			                "Content-Type": "application/json",
			            },
			            body: JSON.stringify({ username, query: searchQuery }),
			        });
					
			        if (!response.ok) {
			            const error = await response.json();
			            alert(error);
			        }
			    } catch (error) {
			        alert("An error occurred: " + error.message);
			    }
			}
            const weatherData = await getWeatherbyCoords(latitude, longitude);
            if (weatherData) {
				citiesData.push(weatherData);
				showLiveDetails(weatherData);
			}
        }
		
        // alerts if no data is found
        if (citiesData.length === 0) {
            alert("No weather data found.");
			document.getElementById("searchContainer").style.display = "none";
            return;
        }

        // displaying weather data
		if (city && cityRadio.checked) {
	        displayWeatherData(citiesData);
			moveBar();
			document.getElementById("detailsContainer").style.display = "none";
		}
    } 
	catch (error) {
        alert("An error occurred: " + error.message);
    }
}
// should only display all cities menu when City radio is checked
// displays live data when Lat/Loc radio is checked
document.getElementById("displayAll").addEventListener("click", showSearches);


// sorting data function
function sortCities() {
	const sortMenu = document.getElementById("sortDropdown");
    const sortOption = sortMenu.value; 

    // sorting
    citiesData.sort((a, b) => {
        switch (sortOption) {
            case "tempLowDesc":
                return b.main.temp_min - a.main.temp_min; 
            case "tempLowAsc":
                return a.main.temp_min - b.main.temp_min; 
            case "tempHighDesc":
                return b.main.temp_max - a.main.temp_max;
            case "tempHighAsc":
                return a.main.temp_max - b.main.temp_max; 
            case "cityNameAZ":
                return a.name.localeCompare(b.name); 
            case "cityNameZA":
                return b.name.localeCompare(a.name); 
            default:
                return 0; 
        }
    });

    // load table with sorted data
    displayWeatherData(citiesData);
}
document.getElementById("sortDropdown").addEventListener("change", sortCities);


// moving search bar: in progress
function moveBar() {
    const searchForm = document.getElementById("searchForm");
	const dispAll = document.getElementById("displayAll");
	const radioContainer = document.getElementById("radioContainer");
	//searchForm.style.display = "none";
	
    searchForm.style.position = "absolute";
    searchForm.style.top = "5px"; 
	searchForm.style.left = "200px";
    searchForm.style.zIndex = "100"; 
	
	dispAll.style.position = "absolute";
	dispAll.style.top = 0;
	dispAll.style.right = "-400px";
	
	radioContainer.style.position = "absolute";
	radioContainer.style.gap = "50px";
	radioContainer.style.right = "-200px";
	radioContainer.style.top = "30px";	
}


// live weather information
async function showLiveDetails(weatherData) {
	document.getElementById("searchContainer").style.display = "none";
	const loc = document.getElementById("location");
	const tempLow = document.getElementById("tempLow");
	const tempHigh = document.getElementById("tempHigh");
	const wind = document.getElementById("wind");
	const humidity = document.getElementById("humidity");
	const coords = document.getElementById("coordinates");
	const currTemp = document.getElementById("currTemp");
	const sunriseset = document.getElementById("sunriseset");

    loc.textContent = weatherData.name;
	
	weatherData = await getWeatherbyCoords(weatherData.coord.lat, weatherData.coord.lon);
    tempLow.textContent = weatherData.main.temp_min.toFixed(0);
    tempHigh.textContent = weatherData.main.temp_max.toFixed(0);
	wind.textContent = weatherData.wind.speed.toFixed(0) + "mi/h";
	humidity.textContent = weatherData.main.humidity.toFixed(0) + "%";
	coords.textContent = weatherData.coord.lon.toFixed(0) + "/" + weatherData.coord.lat.toFixed(0);
	currTemp.textContent = weatherData.main.temp.toFixed(0);
	
	// isolating hours for sunrise and sunset
	const sunrise = weatherData.sys.sunrise;
	const sunset = weatherData.sys.sunset;
	
	// "Unix timestamp to time in JavaScript", <2 lines>, <stackoverflow.com>
	var sunriseDate = new Date(sunrise * 1000);
	var sunsetDate = new Date(sunset * 1000);
	
	var sunriseHours = sunriseDate.getHours() % 12;
	var sunsetHours = sunsetDate.getHours() % 12;
	
	sunriseset.textContent = sunriseHours + "AM/" + sunsetHours + "PM";
	
	document.getElementById("detailsContainer").style.display = "grid";
}





