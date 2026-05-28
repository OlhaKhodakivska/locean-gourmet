import './style.css';

const button = document.getElementById("loadMeals");
const mealsContainer = document.getElementById("meals");
const cartItemsContainer = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const finalTotalEl = document.getElementById("final-total");
const tipCheckbox = document.getElementById("tip-checkbox");


const modal = document.getElementById("custom-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalClose = document.getElementById("modal-close");

let cart = [];
const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood";


function showModal(title, message) {
  modalTitle.innerText = title;
  modalMessage.innerText = message;
  modal.classList.add("active");
}

modalClose.addEventListener("click", () => {
  modal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

button.addEventListener("click", async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    displayMeals(data.meals.slice(0, 12));
    button.style.display = "none";
  } catch (error) {
    console.error("Error:", error);
  }
});

function displayMeals(meals) {
  mealsContainer.innerHTML = "";
  meals.forEach(meal => {
    const price = parseFloat((Math.random() * (45 - 15) + 15).toFixed(2));
    const mealCard = document.createElement("div");
    mealCard.classList.add("meal-card");

    mealCard.innerHTML = `
      <div class="meal-img-wrapper">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      </div>
      <h3>${meal.strMeal}</h3>
      <div class="meal-price">$${price.toFixed(2)}</div>
      <button class="add-to-cart-btn" data-name="${meal.strMeal}" data-price="${price}">
        Add to Order
      </button>
    `;

    mealCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      addToCart(meal.strMeal, price);
    });

    mealsContainer.appendChild(mealCard);
  });
}

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price;
    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");

    itemEl.innerHTML = `
      <span class="meal-name">${item.name}</span>
      <div class="cart-item-controls">
        <span class="item-price">$${item.price.toFixed(2)}</span>
        <button class="remove-btn" data-index="${index}">x</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);

    const removeBtn = itemEl.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
      cart.splice(index, 1);
      updateCartUI();
    });
  });

  const tip = tipCheckbox.checked ? subtotal * 0.1 : 0;
  const total = subtotal + tip;

  subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
  finalTotalEl.innerText = `$${total.toFixed(2)}`;
}

tipCheckbox.addEventListener('change', updateCartUI);


document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    showModal("Cart is Empty", "Please select your favorite seafood dishes before confirming the order.");
    return;
  }

  const totalAmount = finalTotalEl.innerText;
  showModal("Order Confirmed", `Thank you! Your order for ${totalAmount} is being prepared by our chefs.`);

  cart = [];
  updateCartUI();
});