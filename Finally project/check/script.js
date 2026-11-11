let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];



for (let i = 0; i < users.length; i++) {
  if (users[i].username === currentUser) {
    const usernameOut = document.getElementById("usernameOut");

    if (usernameOut) {
      usernameOut.textContent = users[i].username;
    }

    break;
  }
}

function initBurgerMenu() {
  const covers = document.querySelectorAll(".menu_cover");

  const burger =
    document.getElementById("burger_menu") ||
    document.querySelector(".burger__menu, .menu");

  if (!covers.length || !burger) return;

  covers.forEach((cover) => {
    cover.style.display = "none";
  });

  function openMenu() {
    burger.style.display = "none";

    covers.forEach((cover) => {
      cover.style.display = "flex";
    });

    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    burger.style.display = "";

    covers.forEach((cover) => {
      cover.style.display = "none";
    });

    document.body.style.overflow = "";
  }

  burger.addEventListener("click", openMenu);

  document.querySelectorAll(".x_icon").forEach((icon) => {
    icon.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
}

initBurgerMenu();

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

/* =====================================================
   CHECKOUT PAGE
===================================================== */

(function () {
  "use strict";

  const Store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        console.warn("Ошибка чтения localStorage:", e);
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error("Ошибка записи localStorage:", e);
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

  function money(value) {
    return "$" + Number(value).toFixed(2);
  }

  const subtotalElement = document.querySelector(
    ".prices .price-row:nth-child(1) span:last-child"
  );

  const shippingElement = document.querySelector(
    ".prices .price-row:nth-child(2) span:last-child"
  );

  const totalElement = document.querySelector(
    ".prices .price-row.total"
  );

  const orderBtn = document.querySelector(".order-btn");

  const SHIPPING_COST = 10;
  const FREE_SHIPPING_FROM = 200;

  function renderPrices() {
    const cart = getCart();

    const subtotal = cart.reduce((sum, item) => {
      return sum + item.price * item.qty;
    }, 0);

    const shipping =
      cart.length === 0 || subtotal >= FREE_SHIPPING_FROM
        ? 0
        : SHIPPING_COST;

    const total = subtotal + shipping;

    if (subtotalElement) {
      subtotalElement.textContent = money(subtotal);
    }

    if (shippingElement) {
      shippingElement.textContent =
        shipping === 0 ? "FREE" : money(shipping);
    }

    if (totalElement) {
      let totalPrice = totalElement.querySelector(".total-price");

      if (!totalPrice) {
        totalPrice = document.createElement("span");
        totalPrice.className = "total-price";
        totalElement.appendChild(totalPrice);
      }

      totalPrice.textContent = money(total);
    }

    if (orderBtn) {
      orderBtn.disabled = cart.length === 0;
    }
  }

  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      const cart = getCart();

      if (cart.length === 0) {
        alert("Корзина пуста");
        return;
      }

      alert("Заказ успешно оформлен!");

      localStorage.removeItem(cartKey());

      renderPrices();
    });
  }

  renderPrices();
})();