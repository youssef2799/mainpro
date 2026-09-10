// Navbar background changes on scroll
const mainNav = document.getElementById('mainNav');

function handleNavbarScroll() {
  if (window.scrollY > 10) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll);
// Run once on load in case the page is refreshed while scrolled
handleNavbarScroll();

// ============================
// VIDEO MODAL
// ============================
const videoUrl = 'https://player.vimeo.com/video/99340873';

const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');

if (videoModal) {
  videoModal.addEventListener('show.bs.modal', () => {
    videoFrame.src = videoUrl + '?autoplay=1';
  });

  videoModal.addEventListener('hidden.bs.modal', () => {
    videoFrame.src = '';
  });
}

// ============================
// RESERVATION SECTION — date / time / person pickers
// ============================
(function () {
  const dateField = document.getElementById('resDateField');
  const timeField = document.getElementById('resTimeField');
  const personField = document.getElementById('resPersonField');

  if (!dateField || !timeField || !personField) return;

  const resDateInput = document.getElementById('resDate');
  const resTimeInput = document.getElementById('resTime');
  const resPersonInput = document.getElementById('resPerson');

  const allFields = [dateField, timeField, personField];

  function closeAllFields(except) {
    allFields.forEach((field) => {
      if (field !== except) field.classList.remove('active');
    });
  }

  function toggleField(field) {
    const willOpen = !field.classList.contains('active');
    closeAllFields(field);
    field.classList.toggle('active', willOpen);
  }

  // Open on click, but don't let a click inside the dropdown itself close it early
  [dateField, timeField, personField].forEach((field) => {
    field.querySelector('input').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleField(field);
    });
    field.querySelector('.res-dropdown').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  document.addEventListener('click', () => closeAllFields(null));

  // ---------- CALENDAR ----------
  const calMonthLabel = document.getElementById('calMonthLabel');
  const calDays = document.getElementById('calDays');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  function renderCalendar() {
    calMonthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    calDays.innerHTML = '';

    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      const blank = document.createElement('button');
      blank.disabled = true;
      calDays.appendChild(blank);
    }

    for (let day = 1; day <= totalDays; day++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = day;

      const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
      const isSelected = day === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();

      if (isToday) btn.classList.add('today');
      if (isSelected) btn.classList.add('selected');

      btn.addEventListener('click', () => {
        selectedDate = new Date(viewYear, viewMonth, day);
        resDateInput.value = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;
        renderCalendar();
        closeAllFields(null);
      });

      calDays.appendChild(btn);
    }
  }

  calPrev.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });

  calNext.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();

  // ---------- TIME LIST ----------
  const resTimeList = document.getElementById('resTimeList');
  const timeSlots = [
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
    '09:00 PM', '10:00 PM'
  ];

  function renderTimeList() {
    resTimeList.innerHTML = '';
    timeSlots.forEach((slot) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = slot;
      if (slot === resTimeInput.value) btn.classList.add('selected');

      btn.addEventListener('click', () => {
        resTimeInput.value = slot;
        renderTimeList();
        closeAllFields(null);
      });

      resTimeList.appendChild(btn);
    });
  }

  renderTimeList();

  // ---------- PERSON LIST ----------
  const resPersonList = document.getElementById('resPersonList');
  const personOptions = ['1 person', '2 person', '3 person', '4 person', '5 person', '6 person', '7 person', '8 person'];

  function renderPersonList() {
    resPersonList.innerHTML = '';
    personOptions.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt;
      if (opt === resPersonInput.value) btn.classList.add('selected');

      btn.addEventListener('click', () => {
        resPersonInput.value = opt;
        renderPersonList();
        closeAllFields(null);
      });

      resPersonList.appendChild(btn);
    });
  }

  renderPersonList();
})
();

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


function openCart() {
    document.getElementById("cart").classList.add("active");
    displayCart();
}

function closeCart() {
    document.getElementById("cart").classList.remove("active");
}