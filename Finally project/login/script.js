const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const usernameInp = document.getElementById("usernameInp").value;
    const passInp = document.getElementById("passInp").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    let found = false;

    for (let i = 0; i < users.length; i++) {
      if (users[i].username === usernameInp && users[i].password === passInp) {
        found = true;
        localStorage.setItem("currentUser", users[i].username);
      }
    }

    if (found) {
      window.location.href = "/account/accaunt.html";
    } else {
      alert("Неверный username или пароль");
    }
  });
}

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
