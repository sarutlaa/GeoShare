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
    const entry = button.parentNode.parentNode.parentNode.parentNode;
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

function drawCircle(latitude, longitude, radius) {
    let color = getRandomColor();
    const circleOptions = {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: radius
    };
    return circle = L.circle([latitude, longitude], circleOptions).addTo(map);

}

function inputRadius(event) {
    var input = event.target;
    var radius = input.radius;
    console.log(radius);

}

function getLocation() {
    const location = document.getElementById("location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            location.innerHTML = `Current location:  Latitude: ${latitude} | Longitude: ${longitude}`;

            // Update "View Larger Map" link
            const newHref = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            osmLinkHref.setAttribute("href", newHref);

            // Move map view
            userLocation = [latitude, longitude];
            map.setView(userLocation, 18);

            // Remove any existing marker
            if (currentLocationMarker) {
                map.removeLayer(currentLocationMarker);
            }

            // Add a new marker for the current location
            currentLocationMarker = L.marker(userLocation).addTo(map);
            circle = drawCircle(latitude, longitude, 120);

       
        });
    } else {
        location.innerHTML = "Geolocation is not supported by this browser.";
    }
}