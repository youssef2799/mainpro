/* ================= CART ================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* Add product to cart */

function addToCart(name, price) {

    const existingProduct = cart.find(
        product => product.name === name
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    displayCart();

    alert(name + " added to cart!");
}


/* Update cart number */

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) return;

    let total = 0;

    cart.forEach(product => {

        total += product.quantity;

    });

    cartCount.textContent = total;
}


/* Display cart */

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent = "0";

        return;
    }


    cart.forEach((product, index) => {

        const productTotal =
            product.price * product.quantity;

        total += productTotal;


        cartItems.innerHTML += `
            <div class="cart-item">

                <div class="cart-item-info">

                    <h3>${product.name}</h3>

                    <p>
                        $${product.price} ×
                        ${product.quantity}
                    </p>

                </div>

                <strong>
                    $${productTotal}
                </strong>

                <button
                    onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>
        `;
    });


    cartTotal.textContent = total;
}


/* Remove product */

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    displayCart();
}


/* Checkout */

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    alert("Your order has been placed!");

    cart = [];

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    displayCart();
}


/* ================= ORDER NOW BUTTONS ================= */

/*
   This automatically connects
   all ORDER NOW buttons to the cart across all pages.
*/

document.addEventListener("DOMContentLoaded", function () {

    const orderButtons =
        document.querySelectorAll(".sig-btn, .menu-item a");


    orderButtons.forEach(function (button) {

        button.addEventListener("click", function (e) {
            e.preventDefault();

            // 1. Food item in menu.html
            const food =
                button.closest(".food");

            if (food) {
                const nameEl = food.querySelector("h3");
                const priceEl = food.querySelector("strong");
                const name = nameEl ? nameEl.textContent.trim() : "Food Item";
                const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, "")) : 0;
                addToCart(name, price);
                return;
            }

            // 2. Signature card in menu.html
            const card =
                button.closest(".signature-card");

            if (card) {
                const nameEl = card.querySelector("h3");
                const priceEl = card.querySelector("strong");
                const name = nameEl ? nameEl.textContent.trim() : "Signature Dish";
                const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, "")) : 0;
                addToCart(name, price);
                return;
            }

            // 3. Signature dish in home.html
            const sigContent = button.closest(".sig-content");
            if (sigContent) {
                const nameEl = sigContent.querySelector(".sig-name");
                const priceEl = sigContent.querySelector(".sig-price");
                const name = nameEl ? nameEl.textContent.trim() : "Signature Dish";
                const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, "")) : 0;
                addToCart(name, price);
                return;
            }

            // 4. Menu item in home.html
            const menuItem = button.closest(".menu-item");
            if (menuItem) {
                const nameEl = menuItem.querySelector("h4");
                const priceEl = menuItem.querySelector("span");
                const name = nameEl ? nameEl.textContent.trim() : "Menu Item";
                const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, "")) : 0;
                addToCart(name, price);
                return;
            }

        });

    });


    updateCartCount();

    displayCart();

    /* Home page video modal setup */
    const videoUrl = 'https://player.vimeo.com/video/99340873';
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');

    if (videoModal && videoFrame) {
        videoModal.addEventListener('show.bs.modal', () => {
            videoFrame.src = videoUrl + '?autoplay=1';
        });

        videoModal.addEventListener('hidden.bs.modal', () => {
            videoFrame.src = '';
        });
    }

});


/* ================= RESERVATION ================= */

document.addEventListener("DOMContentLoaded", function () {

    const reservationForm = document.getElementById("reservationForm");

    if (!reservationForm) return;

    reservationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const guests = document.getElementById("guests").value;

        if (!date || !time || !guests) {
            alert("Please choose date, time and number of guests.");
            return;
        }

        const confDate = document.getElementById("confirmedDate");
        const confTime = document.getElementById("confirmedTime");
        const confGuests = document.getElementById("confirmedGuests");

        if (confDate) confDate.textContent = date;
        if (confTime) confTime.textContent = time;
        if (confGuests) confGuests.textContent = guests;

        localStorage.setItem(
            "reservation",
            JSON.stringify({
                date: date,
                time: time,
                guests: guests
            })
        );

        const resPopup = document.getElementById("reservationPopup");
        if (resPopup) {
            resPopup.classList.add("active");
        } else {
            alert("Reservation Confirmed! 🎉\n\nDate: " + date + "\nTime: " + time + "\nGuests: " + guests);
        }

    });

});

function closeReservation() {
    const resPopup = document.getElementById("reservationPopup");
    if (resPopup) {
        resPopup.classList.remove("active");
    }
}

function openCart() {
    document.getElementById("cart").classList.add("active");
    displayCart();
}

function closeCart() {
    document.getElementById("cart").classList.remove("active");
}

// Automatically inserts the current year into the footer copyright
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

/* ================= CONTACT FORM VALIDATION ================= */
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nameInput = document.getElementById("contactName");
        const emailInput = document.getElementById("contactEmail");
        const subjectInput = document.getElementById("contactSubject");
        const messageInput = document.getElementById("contactMessage");

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const subject = subjectInput ? subjectInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";

        if (!name) {
            alert("Please enter your name.");
            if (nameInput) nameInput.focus();
            return;
        }

        if (!email) {
            alert("Please enter your email address.");
            if (emailInput) emailInput.focus();
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            if (emailInput) emailInput.focus();
            return;
        }

        if (!message) {
            alert("Please enter your message.");
            if (messageInput) messageInput.focus();
            return;
        }

        alert("Thank you, " + name + "! Your message has been sent successfully.");
        contactForm.reset();
    });
});

