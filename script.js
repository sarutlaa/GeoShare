const entryContainer = document.getElementById("entry-container");
const entryTemplate = document.getElementById("entry-template");
const mapFrame = document.querySelector(".map");
const osmLinkHref = document.getElementById("osm-link");

// Initialize the Leaflet map
const map = L.map(mapFrame, {
    center: [39.17294, -86.52328],
    zoom: 17,
    attributionControl: false
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Variable to store the current location marker

let currentLocationMarker = null;
let inputCircle = null;
let longitude = null;
let latitude = null;

// Adds a new blank entry
function addEntry() {
    const newEntry = entryTemplate.content.cloneNode(true);
    entryContainer.appendChild(newEntry);

}

function updateFileName(event) {
    var input = event.target;
    var fileName = input.files[0].name;
    var fileNameElement = input.parentElement.parentElement.parentElement.querySelector(".name");
    fileNameElement.innerHTML = fileName;
    fileNameElement.classList.add('active');
}

function deleteEntry(button) {
    const entry = button.parentNode.parentNode.parentNode;

    // If no input boxes, probably should remove the input circle
    if (inputCircle && entry.parentNode.querySelectorAll(".entry").length < 2) {
        map.removeLayer(inputCircle);
    }

    entry.parentNode.removeChild(entry);

}

function toggleMenu(fileContainer) {
    const menu = fileContainer.querySelector(".menu");
    menu.classList.toggle("active");
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawCircle(latitude, longitude, radius, color = getRandomColor()) {
    const circleOptions = {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: radius
    };
    return circle = L.circle([latitude, longitude], circleOptions).addTo(map);

}

// While the user types in the input radius box,
//  this draws a temporary circle to show the file share radius live
function inputRadius(event) {
    const inputText = event.target.value;

    // Check if the input is a valid integer between 0 and 100000
    const isValidInteger = /^(0|[1-9]\d{0,4}|100000)$/.test(inputText);
    if (inputCircle) {
        map.removeLayer(inputCircle);
    }

    if (isValidInteger) {
        if (longitude && latitude) {
            inputCircle = drawCircle(latitude, longitude, inputText, "#6666ff");
        }
    } else {
        // Cut off the last character (assuming it was the invalid one)
        event.target.value = inputText.slice(0, -1);
    }

}

function updateMapLocation(latitude, longitude) {
    const userLocation = [latitude, longitude];
    // Update location display bar
    const location = document.getElementById("location");
    location.innerHTML = `Current location:  Latitude: ${latitude} | Longitude: ${longitude}`;
    // Remove any existing marker
    if (currentLocationMarker) {
        map.removeLayer(currentLocationMarker);
    }
    // Add a new marker for the current location
    currentLocationMarker = L.marker(userLocation).addTo(map);

    // Relocate file radius input circle
    if (inputCircle) {
        inputCircle.setLatLng(userLocation);
    }
    map.setView(userLocation, 17);
    // Update "View Larger Map" link
    const newHref = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    osmLinkHref.setAttribute("href", newHref);

}

async function uploadFile() {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onloadend = async function () {
        const base64FileContent = reader.result.split(",")[1];
        const payload = {
            fileName: file.name,
            fileContent: base64FileContent,
        };

        try {
            const response = await fetch("https://7w1gk3m52g.execute-api.us-east-2.amazonaws.com/beta/uploadfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            console.log(JSON.stringify(payload));
            if (response.ok) {
                console.log("File uploaded successfully");
            } else {
                console.error("Error uploading file:", response.status, response.statusText, await response.text());
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    reader.readAsDataURL(file);
}



// Function to handle adding a pin to the map
function onMapClick(event) {
    const userLocation = event.latlng;
    latitude = userLocation.lat;
    longitude = userLocation.lng;

    updateMapLocation(latitude, longitude);

    // Turn off Spoof Mode
    toggleSpoofMode();
}

function toggleSpoofMode() {
    const spoofPin = document.getElementById("spoof-pin");
    const isPinAddingMode = spoofPin.classList.toggle("active");
    if (isPinAddingMode) {
        spoofPin.textContent = "Cancel adding pin";
        map.on("click", onMapClick);
    } else {
        spoofPin.textContent = "Set Location";
        map.off("click", onMapClick);
    }
}

function getLocation() {
    const location = document.getElementById("location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            updateMapLocation(latitude, longitude);
        });
    } else {
        location.innerHTML = "Geolocation is not supported by this browser.";
    }
}