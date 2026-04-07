// API URL
var API_URL = "https://thronesapi.com/api/v2/Characters";

// DOM elements
var grid = document.getElementById("characters-grid");
var loader = document.getElementById("loader");
var errorDiv = document.getElementById("error-msg");
var modal = document.getElementById("modal");
var searchBox = document.getElementById("search-box");
var houseFilter = document.getElementById("house-filter");
var sortOption = document.getElementById("sort-option");
var noResults = document.getElementById("no-results");

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
            fillHouseDropdown();
            displayCharacters(allCharacters);
        })
        .catch(function (error) {
            console.log("Error fetching data:", error);
            loader.style.display = "none";
            errorDiv.style.display = "block";
        });
}


// ---- Fill house filter dropdown from data ----
function fillHouseDropdown() {
    // get unique family names using reduce
    var families = allCharacters.reduce(function (list, char) {
        if (char.family && list.indexOf(char.family) === -1) {
            list.push(char.family);
        }
        return list;
    }, []);

    // sort family names alphabetically
    families.sort();

    // add each family as an option
    families.forEach(function (fam) {
        var opt = document.createElement("option");
        opt.value = fam;
        opt.textContent = fam;
        houseFilter.appendChild(opt);
    });
}


// ---- Search + Filter + Sort (all using array HOFs) ----
function applyFilters() {
    var searchText = searchBox.value.toLowerCase();
    var selectedHouse = houseFilter.value;
    var selectedSort = sortOption.value;

    // step 1: filter by search text using .filter()
    var result = allCharacters.filter(function (char) {
        return char.fullName.toLowerCase().indexOf(searchText) !== -1;
    });

    // step 2: filter by house using .filter()
    if (selectedHouse !== "all") {
        result = result.filter(function (char) {
            return char.family === selectedHouse;
        });
    }

    // step 3: sort using .sort()
    if (selectedSort === "a-z") {
        result.sort(function (a, b) {
            return a.fullName.localeCompare(b.fullName);
        });
    } else if (selectedSort === "z-a") {
        result.sort(function (a, b) {
            return b.fullName.localeCompare(a.fullName);
        });
    }

    // show "no results" message if empty
    if (result.length === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

    displayCharacters(result);
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


// ---- Dark / Light mode toggle ----
var isDark = true;

function toggleTheme() {
    isDark = !isDark;
    var btn = document.getElementById("theme-btn");

    if (isDark) {
        document.body.classList.remove("light-mode");
        btn.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.add("light-mode");
        btn.textContent = "🌙 Dark Mode";
    }
}


// ---- Start the app ----
fetchCharacters();
