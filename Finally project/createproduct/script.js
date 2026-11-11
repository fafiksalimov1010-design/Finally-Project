let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
 
for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
        document.getElementById("usernameOut").textContent = users[i].username;
        break; 
    }
}

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

(function () {
  "use strict";

  const ROOT = "../";

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

  /* ---------- только для вошедших ---------- */
  const username = localStorage.getItem("currentUser");
  if (!username) {
    alert("Чтобы добавить товар, войдите в аккаунт");
    window.location.replace(ROOT + "login/inde.html");
    return;
  }

  /* ---------- поля формы ---------- */
  const form = document.querySelector(".hero form");
  if (!form) return;

  const fields = form.querySelectorAll("input, textarea");
  const [brandEl, modelEl, categoryEl, descEl, priceEl, rateEl, imageEl] = fields;
  const preview = form.querySelector("img");
  const submitBtn = form.querySelector("button[type='submit']"); // Кнопка отправки формы

  /* =====================================================================
     ЛОГИКА РЕДАКТИРОВАНИЯ: Читаем ID товара из URL (?edit=12345)
     ===================================================================== */
  const urlParams = new URLSearchParams(window.location.search);
  const editId = Number(urlParams.get("edit")); 
  let isEditMode = false;
  let productToEdit = null;

  const products = Store.get("products", []);
  const list = Array.isArray(products) ? products : [];

  // Если в ссылке есть ID, ищем этот товар у текущего пользователя
  if (editId) {
    productToEdit = list.find(item => item.id === editId && item.owner === username);
    
    if (productToEdit) {
      isEditMode = true;
      if (submitBtn) submitBtn.textContent = "Сохранить изменения"; // Меняем текст на кнопке
      
      // Автоматически заполняем поля формы старыми данными товара
      if (brandEl) brandEl.value = productToEdit.brand || "";
      if (modelEl) modelEl.value = productToEdit.name || "";
      if (categoryEl) categoryEl.value = productToEdit.category || "";
      if (descEl) descEl.value = productToEdit.description || "";
      if (priceEl) priceEl.value = productToEdit.price || "";
      if (rateEl) rateEl.value = productToEdit.rate || "";
      if (imageEl) {
        imageEl.value = productToEdit.image || "";
        if (preview && productToEdit.image) {
          preview.src = productToEdit.image;
          preview.style.display = "";
        }
      }
    }
  }

  /* ---------- живое превью картинки ---------- */
  if (imageEl && preview) {
    // В режиме редактирования не прячем превью, если картинка уже загружена
    if (!isEditMode) preview.style.display = "none"; 

    imageEl.addEventListener("input", () => {
      const url = imageEl.value.trim();
      if (url) {
        preview.src = url;
        preview.style.display = "";
      } else {
        preview.removeAttribute("src");
        preview.style.display = "none";
      }
    });

    preview.addEventListener("error", () => {
      preview.style.display = "none";
    });
  }

  /* ---------- сохранение (Создание или Обновление) ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const brand = brandEl ? brandEl.value.trim() : "";
    const model = modelEl ? modelEl.value.trim() : "";
    const category = categoryEl ? categoryEl.value.trim() : "";
    const description = descEl ? descEl.value.trim() : "";
    const priceRaw = priceEl ? priceEl.value.trim().replace(",", ".") : "";
    const rateRaw = rateEl ? rateEl.value.trim() : "";
    const image = imageEl ? imageEl.value.trim() : "";

    if (!brand || !model || !category || !priceRaw) {
      alert("Заполните минимум: Brand, Model, Category, Price");
      return;
    }

    const price = Number(priceRaw);
    if (!isFinite(price) || price <= 0) {
      alert("Цена должна быть положительным числом");
      return;
    }

    const rate = rateRaw === "" ? 0 : Number(rateRaw);
    if (!Number.isInteger(rate) || rate < 0 || rate > 5) {
      alert("Рейтинг — целое число от 0 до 5");
      return;
    }

    // Достаем актуальный массив перед записью
    const currentProducts = Store.get("products", []);
    let currentList = Array.isArray(currentProducts) ? currentProducts : [];

    if (isEditMode) {
      // Ищем старый товар по ID и обновляем его свойства, не трогая id и дату создания
      currentList = currentList.map(item => {
        if (item.id === editId && item.owner === username) {
          return {
            ...item, 
            brand,
            name: model,
            category,
            description,
            price,
            rate,
            image,
            updatedAt: new Date().toISOString() // Записываем дату изменения
          };
        }
        return item;
      });
    } else {
      // Обычное создание нового товара, если мы зашли без ?edit=ID
      currentList.push({
        id: Date.now(), 
        owner: username,
        brand,
        name: model,
        category,
        description,
        price,
        rate,
        reviews: 0,
        image,
        createdAt: new Date().toISOString(),
      });
    }

    if (!Store.set("products", currentList)) {
      alert("Не удалось сохранить товар — localStorage переполнен");
      return;
    }

    alert(isEditMode ? "Изменения успешно сохранены!" : "Товар сохранён");
    window.location.href = ROOT + "user product/user product.html";
  });

  /* ---------- сброс ---------- */
  const resetBtn = form.querySelector(".resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", (e) => {
      e.preventDefault(); 
      form.reset();
      if (preview) {
        preview.removeAttribute("src");
        preview.style.display = "none";
      }
      // Если форму сбрасывают в режиме редактирования, возвращаем старые данные товара
      if (isEditMode && productToEdit) {
        if (brandEl) brandEl.value = productToEdit.brand || "";
        if (modelEl) modelEl.value = productToEdit.name || "";
        if (categoryEl) categoryEl.value = productToEdit.category || "";
        if (descEl) descEl.value = productToEdit.description || "";
        if (priceEl) priceEl.value = productToEdit.price || "";
        if (rateEl) rateEl.value = productToEdit.rate || "";
        if (imageEl) imageEl.value = productToEdit.image || "";
        if (preview && productToEdit.image) {
          preview.src = productToEdit.image;
          preview.style.display = "";
        }
      }
    });
  }

  /* ---------- бургер-меню ---------- */
  function initBurgerMenu() {
    const covers = document.querySelectorAll(".menu_cover");
    const burger = document.getElementById("burger_menu") || document.querySelector(".burger__menu, .menu");

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
    document.querySelectorAll(".x_icon").forEach((icon) => icon.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  initBurgerMenu();
})();

let logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "/login/login.html"; 
    });
}
