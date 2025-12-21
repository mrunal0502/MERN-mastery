document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Product 1", price: 29.9 },
    { id: 2, name: "Product 2", price: 9.9 },
    { id: 3, name: "Product 3", price: 21.5 },
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const totalPrice = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");
  const cartTotal = document.getElementById("cart-total");

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
        <span>${product.name} - $${product.price.toFixed(2)}</span>
        <button data-id="${product.id}">Add to Cart</button>
        `;
    productList.appendChild(productDiv);
  });

  // Render cart on page load to show saved items
  renderCart();

  productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId); //get the complete product through id
      addToCart(product);
    }
  });

  function addToCart(product) {
    cart.push(product);
    //console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    let totalprice = 0;
    if (cart.length > 0) {
      emptyCartMessage.classList.add("hidden");
      cartTotal.classList.remove("hidden");
      cartItems.innerHTML = ""; // Clear only when we have items to show
      cart.forEach((item) => {
        totalprice += item.price;
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("product");
        itemDiv.innerHTML = `<span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button style="background-color: #ea0000" data-id="${
              item.id
            }">Remove</button>`;
        cartItems.appendChild(itemDiv);
        totalPrice.textContent = `${totalprice.toFixed(2)}`;
      });
    } else {
      cartItems.innerHTML = `<p id="empty-cart">Your cart is empty.</p>`; // Recreate the empty message
      cartTotal.classList.add("hidden");
      totalPrice.textContent = `$0.00`;
    }
  }

  cartItems.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const productIndex = cart.findIndex((p) => p.id === productId);
      if (productIndex > -1) {
        cart.splice(productIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    }
  });

  checkoutBtn.addEventListener("click", () => {
    cart.length = 0;
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Checkout successful!");
    renderCart();
  });
});
