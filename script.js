// API URL
var API_URL = "https://thronesapi.com/api/v2/Characters";

// DOM elements
var grid = document.getElementById("characters-grid");
var loader = document.getElementById("loader");
var errorDiv = document.getElementById("error-msg");
var modal = document.getElementById("modal");

// store all characters after fetching
var allCharacters = [];


// ---- Fetch characters from API ----
function fetchCharacters() {
    // show loader, hide error
    loader.style.display = "block";
    errorDiv.style.display = "none";
    grid.innerHTML = "";

    fetch(API_URL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function (data) {
            allCharacters = data;
            loader.style.display = "none";
            displayCharacters(allCharacters);
        })
        .catch(function (error) {
            console.log("Error fetching data:", error);
            loader.style.display = "none";
            errorDiv.style.display = "block";
        });
}


// ---- Display characters on the page ----
function displayCharacters(characters) {
    grid.innerHTML = "";

    characters.forEach(function (char) {
        var card = document.createElement("div");
        card.className = "card";
        card.onclick = function () {
            openModal(char);
        };

        card.innerHTML =
            '<img src="' + char.imageUrl + '" alt="' + char.fullName + '">' +
            '<div class="card-info">' +
            '<h3>' + char.fullName + '</h3>' +
            '<p>' + char.family + '</p>' +
            '</div>';

        grid.appendChild(card);
    });
}


// ---- Modal functions ----
function openModal(char) {
    document.getElementById("modal-img").src = char.imageUrl;
    document.getElementById("modal-img").alt = char.fullName;
    document.getElementById("modal-name").textContent = char.fullName;
    document.getElementById("modal-title").textContent = "Title: " + char.title;
    document.getElementById("modal-family").textContent = "Family: " + char.family;
    modal.classList.add("active");
}

function closeModal(event) {
    // close only when clicking overlay or close button, not the box itself
    if (event.target === modal || event.target.classList.contains("close-btn")) {
        modal.classList.remove("active");
    }
}


// ---- Start the app ----
fetchCharacters();
