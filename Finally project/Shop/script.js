/* =====================================================================
   МАГАЗИН

   Что было не так:
   - 5 отдельных массивов, в каждом id 1..4 -> товары не отличить друг
     от друга, корзина была бы невозможна;
   - фильтры перезаписывали друг друга (нельзя совместить категорию и рейтинг);
   - поиск: значение input читалось один раз при загрузке и сравнивалось
     с глобальным window.name — никогда не работал;
   - select "Sort by" ни к чему не подключён;
   - кнопки "add to cart" ничего не делали.
   ===================================================================== */

const Korzina__btn = document.getElementById("Korzina__btn");

Korzina__btn.addEventListener("click", () => {
  window.open("/Korzina/cart.html");
});
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

  /* =================== КАТАЛОГ ===================
     Один массив вместо пяти. id сквозные и уникальные. */
  const CATALOG = [
    // ★★★★★
    {
      id: 1,
      brand: "Hanes",
      name: "Hanes Cotton T-Shirt",
      price: 19.99,
      rate: 5,
      reviews: 62,
      category: "Clothing",
      image:
        "https://theparkwholesale.com/cdn/shop/files/Hanes_5250_White_Front_High_1024x.jpg?v=1768579310",
    },
    {
      id: 2,
      brand: "Nike",
      name: "Nike Running Shoes",
      price: 89.99,
      rate: 5,
      reviews: 65,
      category: "Footwear",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzIKEZFBImDo5ht_oR__G1LX7lf2_u48nNBjSHN1JzNBzDf0xc",
    },
    {
      id: 3,
      brand: "Samsonite",
      name: "Samsonite Backpack",
      price: 79.99,
      rate: 5,
      reviews: 42,
      category: "Accessories",
      image:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQfgc3grVdUVvoujodBRBEWVVNY3nAti8KiP2A68NYSz4rOKU0g",
    },
    {
      id: 4,
      brand: "Apple",
      name: "Apple iPad Pro",
      price: 899.99,
      rate: 5,
      reviews: 47,
      category: "Tablets",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_J9IxEeUvnWOS3M683osIZzP4Yp8DDaIz4Bea-GBEYj6rqhPg",
    },
    // ★★★★
    {
      id: 5,
      image:
        "https://png.pngtree.com/png-vector/20230902/ourmid/pngtree-white-t-shirt-mockup-realistic-t-shirt-png-image_9906363.png",
      name: "White T-Shirt",
      category: "Clothing",
      price: "20",
      rate: 4,
      reviews: 45,
      brand: "Apple",
    },
    {
      id: 6,
      image: "https://pngimg.com/uploads/iphone16/iphone16_PNG27.png",
      name: "Iphone 16 ",
      category: "Tablets",
      price: "199.99",
      rate: 4,
      reviews: 55,
      brand: "Apple",
    },
    {
      id: 7,
      image: "https://cdn-icons-png.flaticon.com/512/4497/4497851.png",
      name: "Multicolor socks",
      category: "Footwear",
      price: "20.99",
      rate: 4,
      reviews: 52,
      brand: "Apple",
    },
    {
      id: 8,
      image:
        "https://www.pngkey.com/png/full/643-6435443_t-shirt-eren-attack-on-titan-t-shirt.png",
      name: "Grey Anime T-Shirt",
      category: "Clothing",
      price: "29.99",
      rate: 4,
      reviews: 32,
      brand: "Apple",
    },

    // ★★★
    {
      id: 9,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKsSqX1fA6-M5HheMKRftC8p3qgrin2kuruEaz-P3X_NA5PKZLEXw_Sco&s=10",
      name: "OUKITEL WP35",
      category: "Tablets",
      price: "200",
      rate: 3,
      reviews: 45,
      brand: "OUKITEL",
    },
    {
      id: 10,
      image:
        "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C91WmNp9gPvL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png",
      name: "t-shirt 67",
      brand: "Shamil",
      category: "Clothing",
      price: "199.99",
      rate: 3,
      reviews: 55,
    },
    {
      id: 11,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/King_Street_Sneak.JPG/250px-King_Street_Sneak.JPG",
      name: "Footwear",
      category: "Footwear",
      price: "20.99",
      rate: 3,
      reviews: 52,
      brand: "Sneakers",
    },
    {
      id: 12,
      image:
        "https://www.w-t.az/storage/products/2025/09/2dYdhJoyCXHuXk2MrKdSMx1GwBljVvKoGpI0iRjR-full.jpg",
      name: "AUT211",
      category: "Accessories",
      price: "29.99",
      rate: 3,
      reviews: 32,
      brand: "1Hora TWS ANC Noise",
    },

    // ★★
    {
      id: 13,
      brand: "amozon",
      name: "slides",
      price: 20,
      rate: 2,
      reviews: 62,
      category: "Footwear",
      image: "https://m.media-amazon.com/images/I/51kwNkprQ3L._AC_UY1000_.jpg",
    },
    {
      id: 14,
      brand: "Nike",
      name: "Nike Running Shoes",
      price: 89.99,
      rate: 2,
      reviews: 65,
      category: "Accessories",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsxU8Vu_b1cP0I3KxiiR2pYoJOcADKMvOqriEBwuUQyQ&s",
    },
    {
      id: 15,
      brand: "Samsonite",
      name: "Samsonite Backpack",
      price: 79.99,
      rate: 2,
      reviews: 42,
      category: "Accessories",
      image:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQfgc3grVdUVvoujodBRBEWVVNY3nAti8KiP2A68NYSz4rOKU0g",
    },
    {
      id: 16,
      brand: "Apple",
      name: "Apple iPad Pro",
      price: 899.99,
      rate: 2,
      reviews: 47,
      category: "Tablets",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_J9IxEeUvnWOS3M683osIZzP4Yp8DDaIz4Bea-GBEYj6rqhPg",
    },

    // ★
    {
      id: 17,
      brand: "Poco",
      name: "Poco xoco choko S22 Ultra Pro max",
      price: 19.99,
      rate: 1,
      reviews: 62,
      category: "undefitned",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWXugcCdpfYexnxz4UNCC782Myw4XYIPJl74arW8RkQ&s",
    },
    {
      id: 18,
      brand: "❌",
      name: "Okak",
      price: 89.99,
      rate: 1,
      reviews: 65,
      category: "undefitned",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy66RW1FP3W7t2MnXWlbtYcMk48odfzoeu6QuACLIwXQ6VY1O5qKEPd-JP&s=10",
    },
    {
      id: 19,
      brand: "❌",
      name: "Скебоб",
      price: 79.99,
      rate: 1,
      reviews: 42,
      category: "undefitned",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCBJ6ATNr7jE8deHQuUvpYBB2btnC2ngKiT6hzFQUcHK9hpD5kyYfqqMI&s=10",
    },
    {
      id: 20,
      brand: "❌",
      name: "Черемша",
      price: 899.99,
      rate: 1,
      reviews: 47,
      category: "undefitned",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg2i3OB9GngzNde-4wfqlCfSB1LnFbaXwGZNaNErNsyQ&s",
    },
  ];

  // товары, добавленные пользователями через creatproduct
  function getUserProducts() {
    const list = Store.get("products", []);
    if (!Array.isArray(list)) return [];

    return list.map((p) => ({
      id: p.id,
      brand: p.brand || "",
      name: p.name || p.model || "Без названия",
      price: Number(p.price) || 0,
      rate: Number(p.rate) || 0,
      reviews: Number(p.reviews) || 0,
      category: p.category || "Other",
      image: p.image || "",
    }));
  }

  function allProducts() {
    return CATALOG.concat(getUserProducts());
  }

  /* =================== РЕНДЕР =================== */
  const container = document.getElementById("shopping");

  function money(n) {
    return "$" + Number(n).toFixed(2);
  }

  function renderProducts(items) {
    if (!container) return;

    container.innerHTML = "";

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Ничего не найдено";
      container.appendChild(empty);
      return;
    }

    items.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const stars = "⭐".repeat(Math.max(0, Math.min(5, product.rate)));

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.brand} ${product.name}</h3>
        <p class="price">${money(product.price)}</p>
        <p class="rate">${stars} (${product.reviews})</p>
        <button class="add-to-cart" data-id="${product.id}">add to cart</button>
      `;

      container.appendChild(card);
    });
  }

  /* =================== ФИЛЬТРЫ =================== */
  // фильтры складываются, а не перезатирают друг друга
  const filters = { category: null, rate: null, query: "", sort: "rate-desc" };

  function applyFilters() {
    let items = allProducts();

    if (filters.category) {
      items = items.filter((p) => p.category === filters.category);
    }

    if (filters.rate) {
      items = items.filter((p) => p.rate === filters.rate);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();

      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
      );
    }

    switch (filters.sort) {
      case "price-asc":
        items = items.slice().sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        items = items.slice().sort((a, b) => b.price - a.price);
        break;

      case "rate-desc":
        items = items.slice().sort((a, b) => b.rate - a.rate);
        break;

      case "name-asc":
        items = items.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    renderProducts(items);
  }

  /* --- категории --- */
  ["Clothing", "Footwear", "Accessories", "Tablets", "undefitned"].forEach(
    (category) => {
      const btn = document.getElementById(category);
      if (!btn) return;
      btn.addEventListener("click", () => {
        filters.rate = null;
        filters.category = filters.category === category ? null : category;
        applyFilters();
      });
    },
  );

  /* --- рейтинг --- */
  [1, 2, 3, 4, 5].forEach((rate) => {
    const btn = document.getElementById("Stars" + rate);
    if (!btn) return;

    btn.addEventListener("click", () => {
      filters.category = null;
      filters.rate = filters.rate === rate ? null : rate;
      applyFilters();
    });
  });

  /* --- поиск --- */
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filters.query = searchInput.value.trim();
      applyFilters();
    });
    // Enter внутри поля не должен перезагружать страницу
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
  }

  /* --- сброс всех фильтров --- */
  const allBtn = document.querySelector(".all_products");
  if (allBtn) {
    allBtn.addEventListener("click", () => {
      filters.category = null;
      filters.rate = null;
      filters.query = "";
      filters.sort = "default";
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "default";
      applyFilters();
    });
  }

  /* --- сортировка --- */
  const sortSelect = document.getElementById("Sort");
  if (sortSelect) {
    sortSelect.innerHTML = `
      <option value="default">Sort by</option>
      <option value="price-asc">Цена: сначала дешевле</option>
      <option value="price-desc">Цена: сначала дороже</option>
      <option value="rate-desc" selected>Рейтинг</option>
      <option value="name-asc">Название A-Z</option>
    `;

    sortSelect.addEventListener("change", () => {
      filters.sort = sortSelect.value;
      applyFilters();
    });
  }

  /* =================== КОРЗИНА ===================
     Один обработчик на контейнер вместо обработчика на каждой карточке —
     работает и для карточек, отрисованных позже. */
  if (container) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart");
      if (!btn) return;

      const id = Number(btn.dataset.id);
      const product = allProducts().find((p) => p.id === id);
      if (!product) return;

      const cart = getCart();
      const inCart = cart.find((item) => item.id === id);

      if (inCart) {
        inCart.qty += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.brand + " " + product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        });
      }

      setCart(cart);

      // короткая подсказка вместо alert
      const oldText = btn.textContent;
      btn.textContent = "added ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = oldText;
        btn.disabled = false;
      }, 800);
    });
  }

  applyFilters();

  /* =================== БУРГЕР-МЕНЮ =================== */
  function initBurgerMenu() {
    const menuCover = document.querySelector(".menu_cover");
    const burgerMenu =
      document.getElementById("burger_menu") ||
      document.querySelector(".burger__menu") ||
      document.querySelector(".menu");

    const closeBtn = document.getElementById("x_icon");

    if (!menuCover || !burgerMenu || !closeBtn) return;

    menuCover.style.display = "none";

    function openMenu() {
      menuCover.style.display = "flex";
      burgerMenu.style.display = "none";
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      menuCover.style.display = "none";
      burgerMenu.style.display = "";
      document.body.style.overflow = "";
    }

    burgerMenu.addEventListener("click", openMenu);

    closeBtn.addEventListener("click", closeMenu);
  }

  document.addEventListener("DOMContentLoaded", initBurgerMenu);
})();

let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];


for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
        document.getElementById("usernameOut").textContent = users[i].username;
        break; 
    }
}