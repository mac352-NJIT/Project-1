/* =========================================
   1. CHECKOUT LOGIC (Country/State Dropdown)
   ========================================= */
const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');

if (countrySelect && stateSelect) {
    const usStates = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
    const caProvinces = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"];

    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        stateSelect.innerHTML = '<option value="">Choose...</option>';
        let optionsList = [];
        if (selectedCountry === 'US') optionsList = usStates;
        else if (selectedCountry === 'CA') optionsList = caProvinces;

        optionsList.forEach(function(region) {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            stateSelect.appendChild(option);
        });
    });
}

/* =========================================
   2. SHOPPING CART LOGIC (With Quantity)
   ========================================= */

// UPDATED: Groups items together instead of adding duplicates
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // If yes, just increase the number
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // If no, add new item with quantity 1
        let product = {
            name: name,
            price: price,
            image: image,
            quantity: 1
        };
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " added to cart!");
}

// UPDATED: Calculates totals based on Quantity
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartTable = document.getElementById('cart-items');
    let totalElement = document.getElementById('cart-total');
    let subtotalElement = document.getElementById('cart-subtotal');
    
    if (!cartTable) return; 

    cartTable.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartTable.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
    } else {
        cart.forEach((item, index) => {
            // Math: Price * Quantity
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            let row = `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" width="40" class="me-2" alt="Item">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" class="form-control" 
                               value="${item.quantity}" min="1" style="width: 70px;" 
                               onchange="updateQuantity(${index}, this.value)">
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
                </tr>
            `;
            cartTable.innerHTML += row;
        });
    }

    if(totalElement) totalElement.innerText = "$" + total.toFixed(2);
    if(subtotalElement) subtotalElement.innerText = "$" + total.toFixed(2);
}

// NEW FUNCTION: Updates cart when user types in the input box
function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ensure quantity is at least 1
    if (newQty < 1) newQty = 1;
    
    cart[index].quantity = parseInt(newQty);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    loadCart(); // Refresh the screen to show new totals
    loadCheckout();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); 
    loadCheckout(); 
}

// UPDATED: Shows correct Quantity in Checkout List
function loadCheckout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let listContainer = document.querySelector('.col-md-5 .list-group');
    if (!listContainer) return;

    let total = 0;
    let listHTML = '';

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        listHTML += `
          <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">${item.name}</h6>
              <small class="text-body-secondary">Qty: ${item.quantity}</small>
            </div>
            <span class="text-body-secondary">$${itemTotal.toFixed(2)}</span>
          </li>
        `;
    });

    listHTML += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (USD)</span>
            <strong>$${total.toFixed(2)}</strong>
        </li>
    `;

    listContainer.innerHTML = listHTML;
}

// GLOBAL LISTENER
document.addEventListener('DOMContentLoaded', () => {
    loadCart();      
    loadCheckout();  
});