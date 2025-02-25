document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded!");

    let moviesBtn = document.getElementById("moviesBtn");
    let showsBtn = document.getElementById("showsBtn");
    let savedBtn = document.getElementById("savedBtn");
    let recommendBtn = document.getElementById("recommendBtn");
    let searchBar = document.getElementById("searchBar");
    let sortOptions = document.getElementById("sortOptions");

    let resultsDiv = document.getElementById("results");
    let savedSection = document.getElementById("savedSection");
    let savedItemsDiv = document.getElementById("savedItems");
    let languageSelection = document.getElementById("languageSelection");

    // Event listeners for section buttons
    moviesBtn.addEventListener("click", function () {
        openSection("movies");
    });

    showsBtn.addEventListener("click", function () {
        openSection("shows");
    });

    savedBtn.addEventListener("click", function () {
        toggleSavedSection();
    });

    recommendBtn.addEventListener("click", function () {
        getRecommendations();
    });

    searchBar.addEventListener("input", function () {
        searchItems();
    });

    sortOptions.addEventListener("change", function () {
        sortMoviesByRating();
    });

    function openSection(type) {
        console.log("Selected type:", type);
        sessionStorage.setItem("selectedType", type);

        resultsDiv.innerHTML = "";
        savedSection.style.display = "none";
        savedItemsDiv.innerHTML = "";
        languageSelection.style.display = "block";
    }

    function getRecommendations() {
        let type = sessionStorage.getItem("selectedType");
        let language = document.getElementById("language").value;
        let apiUrl = `/${type}?language=${language}`;

        console.log("Fetching data from:", apiUrl);

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log("Received data:", data);
                resultsDiv.innerHTML = "";

                if (data.message) {
                    resultsDiv.innerHTML += `<p>${data.message}</p>`;
                    return;
                }

                data.forEach(item => {
                    let entry = document.createElement("div");
                    entry.classList.add("movie-card");
                    entry.setAttribute("data-rating", item.rating);
                    entry.innerHTML = `
                        <h3>${item.title}</h3>
                        <p><strong>Rating:</strong> ${item.rating}</p>
                        <p><strong>Streaming On:</strong> ${item.platform}</p>
                        <p>${item.description}</p>
                        <button class="save-btn" data-title="${item.title}" data-rating="${item.rating}" data-platform="${item.platform}" data-description="${item.description}">Save</button>
                    `;
                    resultsDiv.appendChild(entry);
                });

                attachSaveListeners();
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function sortMoviesByRating() {
        let movies = document.querySelectorAll(".movie-card");
        let movieList = Array.from(movies);
        let sortOption = sortOptions.value;

        if (sortOption === "highToLow") {
            movieList.sort((a, b) => {
                let ratingA = parseFloat(a.getAttribute("data-rating"));
                let ratingB = parseFloat(b.getAttribute("data-rating"));
                return ratingB - ratingA;
            });
        }

        resultsDiv.innerHTML = "";
        movieList.forEach(movie => resultsDiv.appendChild(movie));
    }

    function attachSaveListeners() {
        document.querySelectorAll(".save-btn").forEach(button => {
            button.addEventListener("click", function () {
                let title = this.getAttribute("data-title");
                let rating = this.getAttribute("data-rating");
                let platform = this.getAttribute("data-platform");
                let description = this.getAttribute("data-description");

                saveToFavorites(title, rating, platform, description);
            });
        });
    }

    function saveToFavorites(title, rating, platform, description) {
        let savedItems = JSON.parse(localStorage.getItem("saved")) || [];

        if (savedItems.some(item => item.title === title)) {
            alert(title + " is already in saved section.");
            return;
        }

        savedItems.push({ title, rating, platform, description });
        localStorage.setItem("saved", JSON.stringify(savedItems));
        alert(title + " added to saved section!");
        displaySavedItems();
    }

    function displaySavedItems() {
        let savedItems = JSON.parse(localStorage.getItem("saved")) || [];
        savedItemsDiv.innerHTML = "";

        if (savedItems.length === 0) {
            savedItemsDiv.innerHTML = "<p>No saved items.</p>";
        } else {
            savedItems.forEach(item => {
                let entry = document.createElement("div");
                entry.classList.add("saved-card");
                entry.innerHTML = `
                    <h3>${item.title}</h3>
                    <p><strong>Rating:</strong> ${item.rating}</p>
                    <p><strong>Streaming On:</strong> ${item.platform}</p>
                    <p>${item.description}</p>
                    <button class="remove-btn" data-title="${item.title}">Remove</button>
                `;
                savedItemsDiv.appendChild(entry);
            });
        }

        attachRemoveListeners();
    }

    function attachRemoveListeners() {
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                let title = this.getAttribute("data-title");
                removeFromFavorites(title);
            });
        });
    }

    function removeFromFavorites(title) {
        let savedItems = JSON.parse(localStorage.getItem("saved")) || [];
        let updatedItems = savedItems.filter(item => item.title !== title);
        localStorage.setItem("saved", JSON.stringify(updatedItems));
        displaySavedItems();
    }

    function searchItems() {
        let query = searchBar.value.toLowerCase();
        let items = document.querySelectorAll(".movie-card, .saved-card");

        items.forEach(item => {
            let title = item.querySelector("h3").innerText.toLowerCase();
            item.style.display = title.includes(query) ? "block" : "none";
        });
    }

    function toggleSavedSection() {
        if (savedSection.style.display === "none" || savedSection.style.display === "") {
            savedSection.style.display = "block";
            displaySavedItems();
        } else {
            savedSection.style.display = "none";
        }
    }
});













































































