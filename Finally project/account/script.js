let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];

if (!currentUser) {
  window.location.href = "login.html";
}

for (let i = 0; i < users.length; i++) {
  if (users[i].username === currentUser) {
    document.getElementById("nameOut").textContent = users[i].name;
    document.getElementById("EmailOut").textContent = users[i].email;
    document.getElementById("SurnameOut").textContent = users[i].Surname;
    document.getElementById("usernameOut").textContent = users[i].username;
  }
}

let sale__btn = document.querySelector(".sale-btn");

sale__btn.addEventListener("click", function () {
  window.location.href = "/user product/user product.html";
});

logoutBtn

let Logout__btn = document. getElementById("logoutBtn");

Logout__btn.addEventListener("click", function () {
  window.location.href = "/login/login.html";
});

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