// Pop-up

function openPopup() {
    document.getElementById('popup').style.display = 'flex';
}

function openPopup2() {
    document.getElementById('popup2').style.display = 'flex';
}

function openPopup3() {
    document.getElementById('popup3').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function closePopup2() {
    document.getElementById('popup2').style.display = 'none';
}
function closePopup3() {
    document.getElementById('popup3').style.display = 'none';
}

function openPopup4() {
    document.getElementById('popup4').style.display = 'flex';
}
function closePopup4() {
    document.getElementById('popup4').style.display = 'none';
}

function openPopup5() {
    document.getElementById('popup5').style.display = 'flex';
}
function closePopup5() {
    document.getElementById('popup5').style.display = 'none';
}

function openPopup10() {
    document.getElementById('popup10').style.display = 'flex';
}
function closePopup10() {
    document.getElementById('popup10').style.display = 'none';
}
function openPopup11() {
    document.getElementById('popup11').style.display = 'flex';
}
function closePopup11() {
    document.getElementById('popup11').style.display = 'none';
}

const gsearchInput = document.getElementById('gsearch-input');
const gsuggestionsContainer = document.getElementById('gsuggestions-container');
const gsearchButton = document.getElementById('gsearch-button');
const googlesearchButton = document.getElementById('googlesearch-button');

let debounceTimeout;

// Function to fetch and display suggestions
async function fetchSuggestions(query) {
    if (query.length < 2) { // Only fetch suggestions for queries with at least 2 characters
        gsuggestionsContainer.innerHTML = '';
        gsuggestionsContainer.style.display = 'none'; // Use style.display for plain CSS 'hidden'
        return;
    }

    // In a real application, you would make an API call here.
    // For this example, we'll use a simulated list of suggestions.
    const allPossibleSuggestions = [
        "how to make a website",
        "how to make a search bar",
        "how to make a good coffee",
        "how to make a cake",
        "best programming languages",
        "best front-end frameworks",
        "best back-end frameworks",
        "weather today",
        "news headlines",
        "latest tech news",
        "javascript tutorial",
        "python tutorial",
        "react tutorial",
        "tailwind css tutorial",
        "what is AI",
        "what is machine learning",
        "what is deep learning",
        "what is quantum computing",
        "history of the internet",
        "famous landmarks",
        "world capitals",
        "healthy recipes",
        "exercise routines",
        "meditation benefits"
    ];

    const gsuggestions = allPossibleSuggestions.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8); // Limit to 8 suggestions

    gdisplaySuggestions(suggestions);
}

// Function to display suggestions in the container
function gdisplaySuggestions(gsuggestions) {
    gsuggestionsContainer.innerHTML = ''; // Clear previous suggestions
    if (gsuggestions.length === 0) {
        gsuggestionsContainer.style.display = 'none'; // Use style.display for plain CSS 'hidden'
        return;
    }

    gsuggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item'); // Use custom class
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', () => {
            gsearchInput.value = suggestion;
            performSearch(suggestion);
            gsuggestionsContainer.style.display = 'none'; // Use style.display for plain CSS 'hidden'
        });
        gsuggestionsContainer.appendChild(suggestionItem);
    });
    gsuggestionsContainer.style.display = 'block'; // Use style.display for plain CSS 'block'
}

// Function to perform a Google search
function performSearch(query) {
    if (query) {
        // window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
}

function performGoogleSearch(query) {
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        // window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
}

// Event listener for input changes (with debouncing)
gsearchInput.addEventListener('input', (event) => {
    clearTimeout(debounceTimeout);
    const query = event.target.value;
    debounceTimeout = setTimeout(() => {
        fetchSuggestions(query);
    }, 300); // Debounce for 300ms
});

// Event listener for search button click
gsearchButton.addEventListener('click', () => {
    performSearch(gsearchInput.value);
    gsuggestionsContainer.style.display = 'none'; // Use style.display for plain CSS 'hidden'
});

// Event listener for search button click
googlesearchButton.addEventListener('click', () => {
    performGoogleSearch(gsearchInput.value);
    gsuggestionsContainer.style.display = 'none'; // Use style.display for plain CSS 'hidden'
});

// Event listener for Enter key press on the input field
gsearchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch(gsearchInput.value);
        gsuggestionsContainer.style.display = 'none'; // Use style.display for plain CSS 'hidden'
    }
});

// Hide suggestions when clicking outside the search bar or suggestions
document.addEventListener('click', (event) => {
    if (!gsearchInput.contains(event.target) && !gsuggestionsContainer.contains(event.target)) {
        gsuggestionsContainer.style.display = 'none'; // Use style.display for plain CSS 'hidden'
    }
});

// Show suggestions again if input is focused and has text
gsearchInput.addEventListener('focus', () => {
    if (gsearchInput.value.length >= 2 && gsuggestionsContainer.children.length > 0) {
        gsuggestionsContainer.style.display = 'block'; // Use style.display for plain CSS 'block'
    }
});




      

// Dark Mode Toggle

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Initial check
if (prefersDarkScheme.matches) {
  document.documentElement.classList.add("dark-mode");
} else {
  document.documentElement.classList.add("light-mode");
}

// Listen for changes in system preference
prefersDarkScheme.addEventListener("change", (e) => {
  if (e.matches) {
    document.documentElement.classList.replace("light-mode", "dark-mode");
  } else {
    document.documentElement.classList.replace("dark-mode", "light-mode");
  }
});

const themeToggle = document.getElementById("theme-toggle");
const htmlElement = document.documentElement; // Or document.body

themeToggle.addEventListener("click", () => {
  if (htmlElement.classList.contains("light-mode")) {
    htmlElement.classList.replace("light-mode", "dark-mode");
    localStorage.setItem("theme", "dark"); // Store user preference
  } else {
    htmlElement.classList.replace("dark-mode", "light-mode");
    localStorage.setItem("theme", "light"); // Store user preference
  }
});

// On page load, check for stored preference
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  htmlElement.classList.add(storedTheme + "-mode");
} else if (prefersDarkScheme.matches) {
  htmlElement.classList.add("dark-mode");
} else {
  htmlElement.classList.add("light-mode");
}