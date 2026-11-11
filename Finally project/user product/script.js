const btn__add = document.querySelector(".btn__add"); 

if (btn__add) {
    btn__add.addEventListener("click", function () { 
        window.location.href = "/createproduct/credproduct.html"; 
    });
}


const log_btn = document.querySelector(".log_in"); 
const log_btn1 = document.querySelector(".log_in1"); 

if (log_btn) {
    log_btn.addEventListener("click", () => { 
        window.open("/login/login.html"); 
    });
}

if (log_btn1) {
    log_btn1.addEventListener("click", () => { 
        window.open("/login/login.html"); 
    });
}




/* =====================================================================
   МОИ ТОВАРЫ (userproduct/index.html)
   Страница была пустой: выводим товары текущего пользователя
   из localStorage и даём их удалять.
   ===================================================================== */
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
    window.location.replace(ROOT + "login/inde.html");
    return;
  }

  const box = document.querySelector(".container_header");
  if (!box) return;

  function money(n) {
    return "$" + Number(n).toFixed(2);
  }

  function getProducts() {
    const list = Store.get("products", []);
    return Array.isArray(list) ? list : [];
  }

  function render() {
    const mine = getProducts().filter((p) => p.owner === username);

    box.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "My products for sale";
    box.appendChild(title);

    if (mine.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Вы пока не добавили ни одного товара.";
      box.appendChild(empty);
    } else {
      mine.forEach((p) => {
        const row = document.createElement("div");
        row.className = "user_product";
        
        // Создаем ссылку на страницу редактирования, передавая ID товара
        const editUrl = `/createproduct/credproduct.html?edit=${p.id}`;

        row.innerHTML = `
          <img src="${p.image || ""}" alt="${p.name || ""}" width="80">
          <span>${p.brand || ""} ${p.name || ""}</span>
          <span>${p.category || ""}</span>
          <span>${money(p.price)}</span>
          <span>${"⭐".repeat(Math.max(0, Math.min(5, Number(p.rate) || 0)))}</span>
          <a href="${editUrl}" class="edit_product" >редактировать</a>
          <button type="button" class="delete_product" data-id="${p.id}">удалить</button>
        `;
        box.appendChild(row);
      });
    }

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "add_product";
    addBtn.textContent = "+ добавить товар";
    addBtn.addEventListener("click", () => {
      window.location.href = ROOT + "/createproduct/credproduct.html";
    });
    box.appendChild(addBtn);
  }

  /* ---------- удаление ---------- */
  box.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete_product");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    if (!confirm("Удалить этот товар?")) return;

    const rest = getProducts().filter(
      (p) => !(p.id === id && p.owner === username)
    );

    Store.set("products", rest);
    render();
  });

  render();

  /* ---------- бургер-меню ---------- */
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







let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
 
for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
        document.getElementById("usernameOut").textContent = users[i].username;
        break; 
    }
}
