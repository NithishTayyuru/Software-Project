document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display events
    fetchEvents();

    // Event Listeners
    document.getElementById("search-button").addEventListener("click", searchEvents);
    document.getElementById("filter-btn").addEventListener("click", applyFilters);
    document.getElementById("login-form").addEventListener("submit", loginUser);
    document.getElementById("register-form").addEventListener("submit", registerUser);
    document.getElementById("checkout-btn").addEventListener("click", checkout);

    // Close modals
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", () => btn.closest(".modal").style.display = "none");
    });
});

// Fetch events from the backend
function fetchEvents() {
    fetch("/api/events")
        .then(response => response.json())
        .then(events => displayEvents(events))
        .catch(error => console.error("Error fetching events:", error));
}

// Display events in grid
function displayEvents(events) {
    let container = document.getElementById("all-events-container");
    container.innerHTML = "";
    events.forEach(event => {
        let eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
            <div class="event-image">
                <img src="${event.image}" alt="Event Image">
                <span class="event-category">${event.category}</span>
            </div>
            <div class="event-details">
                <h4>${event.title}</h4>
                <p>${event.description}</p>
                <div class="event-meta">
                    <span><i class="far fa-calendar"></i> ${event.date}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
                <button class="view-details-btn" onclick="viewEventDetails(${event.id})">View Details</button>
                <button class="add-to-cart-btn" onclick="addToCart(${event.id})">Add to Cart</button>
            </div>
        `;
        container.appendChild(eventCard);
    });
}

// Search events
function searchEvents() {
    let query = document.getElementById("search-input").value;
    fetch(`/api/search?query=${query}`)
        .then(response => response.json())
        .then(events => displayEvents(events));
}

// Apply filters
function applyFilters() {
    let category = document.getElementById("category-filter").value;
    let location = document.getElementById("location-filter").value;
    let date = document.getElementById("date-filter").value;
    
    fetch(`/api/filter?category=${category}&location=${location}&date=${date}`)
        .then(response => response.json())
        .then(events => displayEvents(events));
}

// View event details
function viewEventDetails(eventId) {
    fetch(`/api/event/${eventId}`)
        .then(response => response.json())
        .then(event => {
            document.getElementById("event-details-container").innerHTML = `
                <h2>${event.title}</h2>
                <p>${event.description}</p>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <button onclick="addToCart(${event.id})">Add to Cart</button>
            `;
            document.getElementById("event-details-modal").style.display = "block";
        });
}

// Add to cart
function addToCart(eventId) {
    fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId })
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector(".cart-count").textContent = data.cart_count;
        alert("Event added to cart!");
    });
}

// Login User
function loginUser(event) {
    event.preventDefault();
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) location.reload();
        else alert("Invalid credentials");
    });
}

// Register User
function registerUser(event) {
    event.preventDefault();
    let name = document.getElementById("register-name").value;
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;

    fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) location.reload();
        else alert("Registration failed");
    });
}

// Checkout
function checkout() {
    fetch("/api/cart/checkout", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            alert("Checkout complete!");
            document.querySelector(".cart-count").textContent = "0";
        });
}
