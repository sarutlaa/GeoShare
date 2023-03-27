const entryContainer = document.getElementById("entry-container");
const entryTemplate = document.getElementById("entry-template");
const mapIframe = document.querySelector(".map");
const osmLinkHref = document.getElementById("osm-link");

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

function getLocation() {
    const location = document.getElementById("location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            location.innerHTML = `Current location:  Latitude: ${latitude} | Longitude: ${longitude}`;
            const newSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.002},${latitude - 0.002},${longitude + 0.002},${latitude + 0.002}&layer=mapnik`;
            mapIframe.setAttribute("src", newSrc);
            const newHref = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
            osmLinkHref.setAttribute("href", newHref);
        });
    } else {
        location.innerHTML = "Geolocation is not supported by this browser.";
    }
}