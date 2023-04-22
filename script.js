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
async function deleteFile(button) {
    button.innerText = "Deleting";
    button.style.backgroundColor = "#22f";

    const fileContainer = button.parentElement.parentElement;
    const nameSpan = fileContainer.querySelector(".name");
    const fileName = nameSpan.textContent;

    console.log("Deleting: ", fileName);

    const payload = {
        fileName: fileName + ".json",
    };

    try {
        const response = await fetch("https://7w1gk3m52g.execute-api.us-east-2.amazonaws.com/beta/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log("File deleted successfully");
            fileContainer.parentNode.remove(); // Remove the file entry from the page
        } else {
            console.error("Error deleting file:", response.status, response.statusText, await response.text());

            button.innerText = "Delete error";
            button.style.backgroundColor = "#f22";
            setTimeout(function () {
                button.innerText = "Delete";
                button.style.backgroundColor = "#666";
            }, 3000);
        }
    } catch (error) {
        console.error("Error deleting file:", error);

        button.innerText = "Delete error";
        button.style.backgroundColor = "#f22";
        setTimeout(function () {
            button.innerText = "Delete";
            button.style.backgroundColor = "#666";
        }, 3000);
    }
}
async function downloadFile(button) {
    button.innerText = "Downloading";
    button.style.backgroundColor = "#22f";

    const fileContainer = button.parentElement.parentElement;
    const nameSpan = fileContainer.querySelector(".name");
    const fileName = nameSpan.textContent;

    console.log("Downloading: ", fileName);

    const payload = {
        fileName: fileName + ".json",
    };

    try {
        const response = await fetch("https://7w1gk3m52g.execute-api.us-east-2.amazonaws.com/beta/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const responseJson = await response.json();
            const fileContent = responseJson.body;
            const jsonData = JSON.parse(fileContent);
            const mimeType = jsonData.mimeType;

            // Create a Blob from the base64 file content
            const byteCharacters = atob(jsonData.fileContent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });

            // Download the file
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = jsonData.fileName;
            link.click();
            URL.revokeObjectURL(link.href);

            console.log("File downloaded successfully");

            button.innerText = "Downloaded";
            button.style.backgroundColor = "#2f2";
            setTimeout(function () {
                button.innerText = "Download";
            }, 3000);

        } else {
            console.error("Error downloading file:", response.status, response.statusText, await response.text());

            button.innerText = "Download error";
            button.style.backgroundColor = "#f22";
            setTimeout(function () {
                button.innerText = "Download";
                button.style.backgroundColor = "#2f2";
            }, 3000);
        }
    } catch (error) {
        console.error("Error downloading file:", error);

        button.innerText = "Download error";
        button.style.backgroundColor = "#f22";
        setTimeout(function () {
            button.innerText = "Download";
            button.style.backgroundColor = "#2f2";
        }, 3000);
    }
}

// Adds a new blank entry
function addEntry(fileName) {
    const newEntry = entryTemplate.content.cloneNode(true);
    const nameSpan = newEntry.querySelector('.name');
    nameSpan.textContent = fileName;
    entryContainer.appendChild(newEntry);

}

// This function sends the user's position to the lambda function scanForFiles
// The lambda function searches the uploads folder in the S3 bucket for files that the
//    user should be able to see, based on the files' locations and radii, and the user location
// Then the lambda function sends a list of the names of all the available files
// Then an entry is created in the entry list for each available file.
async function scanForFiles(button) {
    // Assert coordinates exist
    // If you are wondering why I do this instead of just calling getLocation(),
    // For testing and demonstration, we need the location spoofer, which that would override
    // In a "public release" we would remove the spoofer and put getLocation() here.
    if (latitude == null || longitude == null) {
        console.error("No location coordinates");

        button.innerText = "No location";
        button.style.backgroundColor = "#f22";
        setTimeout(function () {
            button.innerText = "Scan for files";
            button.style.backgroundColor = "#666";
        }, 3000);

        return;
    }

    button.innerText = "Scanning";
    button.style.backgroundColor = "#22f";

    console.log("Scanning");
    const position = {
        longitude: longitude,
        latitude: latitude,
    };

    try {
        const response = await fetch("https://7w1gk3m52g.execute-api.us-east-2.amazonaws.com/beta/scanfiles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(position),
        });

        if (response.ok) {
            entryContainer.innerHTML = '';

            const responseBody = await response.json();
            const availableFiles = JSON.parse(responseBody.body);
            console.log("Files available:", availableFiles);
            for (const fileName of availableFiles) {
                addEntry(fileName);
            }

            button.innerText = "Scan for files";
            button.style.backgroundColor = "#666";
        } else {
            console.error("Error scanning files:", response.status, response.statusText, await response.text());

            button.innerText = "Error scanning files";
            button.style.backgroundColor = "#f22";
            setTimeout(function () {
                button.innerText = "Scan for files";
                button.style.backgroundColor = "#666";
            }, 3000);
        }
    } catch (error) {
        console.error("Error scanning files:", error);

        button.innerText = "Error scanning files";
        button.style.backgroundColor = "#f22";
        setTimeout(function () {
            button.innerText = "Scan for files";
            button.style.backgroundColor = "#666";
        }, 3000);
    }
}


// This function embeds the chosen file inside a json file, along with
//    the user's latitude and longitude, and the file share radius
// Then this json file is encoded inside a payload json that is sent to the
//    lambda function uploadfile(). This function stores the file json in the S3 bucket.
// So if the user uploads image.png, it is stored as image.png.json in the S3 bucket
async function uploadFile(button) {
    button.innerText = "Uploading";
    button.style.backgroundColor = "#22f";
    let radius = document.getElementById("input-radius").value;
    console.log(radius, latitude, longitude);

    // Assert coordinates and radius exist
    if (latitude == null || longitude == null) {
        console.error("No location coordinates");

        button.innerText = "No location";
        button.style.backgroundColor = "#f22";
        setTimeout(function () {
            button.innerText = "Upload";
            button.style.backgroundColor = "#2f2";
        }, 3000);

        return;
    }
    if (radius == null || radius <= 0) {
        console.error("No input radius");

        button.innerText = "No radius";
        button.style.backgroundColor = "#f22";
        setTimeout(function () {
            button.innerText = "Upload";
            button.style.backgroundColor = "#2f2";
        }, 3000);

        return;
    }


    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    // Assert file exists
    if (file == null) {
        console.error("No input file");

        button.innerText = "No file";
        button.style.backgroundColor = "#f22";
        setTimeout(function () {
            button.innerText = "Upload";
            button.style.backgroundColor = "#2f2";
        }, 3000);

        return;
    }

    const reader = new FileReader();
    reader.onloadend = async function () {
        // Convert the file to a base64-encoded string to store in the json
        const base64FileContent = reader.result.split(",")[1];

        const jsonFile = {
            fileName: file.name,
            fileContent: base64FileContent,
            longitude: longitude,
            latitude: latitude,
            radius: radius,
        }

        // Convert jsonFile to a json string
        const jsonString = JSON.stringify(jsonFile);

        // Convert the json string to a base64-encoded string
        const base64Json = btoa(jsonString);

        const payload = {
            fileName: file.name + ".json",
            fileContent: base64Json,
        };

        try {
            const response = await fetch("https://7w1gk3m52g.execute-api.us-east-2.amazonaws.com/beta/uploadfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log("File uploaded successfully");
                addEntry(payload.fileName.slice(0, -5));

                button.innerText = "Uploaded";
                button.style.backgroundColor = "#2f2";
                setTimeout(function () {
                    button.innerText = "Upload";
                }, 3000);
            } else {
                console.error("Error uploading file:", response.status, response.statusText, await response.text());

                button.innerText = "Upload Error";
                button.style.backgroundColor = "#f22";
                setTimeout(function () {
                    button.innerText = "Upload";
                    button.style.backgroundColor = "#2f2";
                }, 3000);
            }
        } catch (error) {
            console.error("Error uploading file:", error);

            button.innerText = "Upload Error";
            button.style.backgroundColor = "#f22";
            setTimeout(function () {
                button.innerText = "Upload";
                button.style.backgroundColor = "#2f2";
            }, 3000);
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

function getLocation(button) {
    console.log("Getting Location");

    if (button) {
        button.innerText = "Getting Location";
        button.style.backgroundColor = "#22f";
    }

    const location = document.getElementById("location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            updateMapLocation(latitude, longitude);
            if (button) {
                button.innerText = "Get Location";
                button.style.backgroundColor = "#2f2";
            }
        });


    } else {
        location.innerHTML = "Geolocation is not supported by this browser.";

        if (button) {
            button.innerText = "No Geolocation";
            button.style.backgroundColor = "#f22";
            setTimeout(function () {
                button.innerText = "Get Location";
                button.style.backgroundColor = "#2f2";
            }, 3000);
        }
    }
}