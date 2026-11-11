const log_btn = document.getElementById("log_in");
if (log_btn) {
  log_btn.addEventListener("click", () => {
    window.open("/login/login.html");
  });
}

const log_btn1 = document.getElementById("log_in1");
if (log_btn1) {
  log_btn1.addEventListener("click", () => {
    window.open("/login/login.html");
  });
}

let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
 
for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
        document.getElementById("usernameOut").textContent = users[i].username;
        break; 
    }
}

/* =====================================================================
   КОРЗИНА (card/index.html)
   Раньше здесь был только код бургер-меню, товары не выводились вообще.
   ===================================================================== */
(function () {
  "use strict";

  const ROOT = "../";

  /* =================== ХРАНИЛИЩЕ =================== */
  const Store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        console.warn("Битые данные в localStorage:", key, e);
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error("Не удалось записать в localStorage:", key, e);
        return false;
      }
    },
  };

  function cartKey() {
    return "cart:" + (localStorage.getItem("currentUser") || "guest");
  }
  function getCart() {
    const cart = Store.get(cartKey(), []);
    return Array.isArray(cart) ? cart : [];
  }
  function setCart(items) {
    Store.set(cartKey(), items);
  }

  function money(n) {
    return "$" + Number(n).toFixed(2);
  }

  /* =================== ЭЛЕМЕНТЫ =================== */
  const productBox = document.querySelector(".product");
  const totalsBox = document.querySelector(".card_wrapper .card");
  const totalLines = totalsBox
    ? totalsBox.querySelectorAll("div > p") // [subtotal, shipping, total]
    : [];
  const checkoutBtn = totalsBox ? totalsBox.querySelector("button") : null;

  const SHIPPING_COST = 10;
  const FREE_SHIPPING_FROM = 200;

  /* =================== РЕНДЕР =================== */
  function renderCart() {
    const cart = getCart();

    if (productBox) {
      productBox.innerHTML = "";

      if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Корзина пуста";
        productBox.appendChild(empty);
      } else {
        cart.forEach((item) => {
          const row = document.createElement("div");
          row.className = "cart_item";
          row.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="60">
            <span class="cart_item__name">${item.name}</span>
            <span class="cart_item__price">${money(item.price)}</span>
            <button type="button" class="qty_btn" data-action="minus" data-id="${item.id}">-</button>
            <span class="cart_item__qty">${item.qty}</span>
            <button type="button" class="qty_btn" data-action="plus" data-id="${item.id}">+</button>
            <span class="cart_item__sum">${money(item.price * item.qty)}</span>
            <button type="button" class="qty_btn" data-action="remove" data-id="${item.id}">x</button>
          `;
          productBox.appendChild(row);
        });
      }
    }

    // итоги
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping =
      cart.length === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    if (totalLines.length >= 3) {
      totalLines[0].textContent = "subtotal: " + money(subtotal);
      totalLines[1].textContent =
        "shipping: " + (shipping === 0 ? "free" : money(shipping));
      totalLines[2].textContent = "total: " + money(total);
    }

    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  }

  /* =================== КНОПКИ +/-/удалить =================== */
  if (productBox) {
    productBox.addEventListener("click", (e) => {
      const btn = e.target.closest(".qty_btn");
      if (!btn) return;

      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      let cart = getCart();
      const index = cart.findIndex((item) => item.id === id);
      if (index === -1) return;

      if (action === "plus") {
        cart[index].qty += 1;
      } else if (action === "minus") {
        cart[index].qty -= 1;
        if (cart[index].qty <= 0) cart.splice(index, 1);
      } else if (action === "remove") {
        cart.splice(index, 1);
      }

      setCart(cart);
      renderCart();
    });
  }

  /* =================== ПЕРЕХОД К ОФОРМЛЕНИЮ =================== */
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length === 0) {
        alert("Корзина пуста");
        return;
      }
      window.location.href = ROOT + "/check/check out.html";
    });
  }

  renderCart();

  /* =================== БУРГЕР-МЕНЮ =================== */
  function initBurgerMenu() {
    const covers = document.querySelectorAll(".menu_cover");
    const burger =
      document.getElementById("burger_menu") ||
      document.querySelector(".burger__menu, .menu");

    if (!covers.length || !burger) return;

    covers.forEach((cover) => (cover.style.display = "none"));

    function openMenu() {
      burger.style.display = "none";
      covers.forEach((cover) => (cover.style.display = "flex"));
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      burger.style.display = "";
      covers.forEach((cover) => (cover.style.display = "none"));
      document.body.style.overflow = "";
    }

    burger.addEventListener("click", openMenu);
    document
      .querySelectorAll(".x_icon")
      .forEach((icon) => icon.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  initBurgerMenu();
})();