const submit_btn = document.getElementById("submit_btn");

function saveToLocalStorage() {
  const name_INP = document.getElementById("name");
  const phone_INP = document.getElementById("phone");
  const email_INP = document.getElementById("email");
  const message_INP = document.getElementById("message");

 
  if (
    name_INP.value.trim() === "" ||
    phone_INP.value.trim() === "" ||
    email_INP.value.trim() === "" ||
    message_INP.value.trim() === ""
  ) {
    alert("Пожалуйста напишите инфармацую чтобы мы могли с вами связаться");
    return;
  }

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  const newReview = {
    name: name_INP.value,
    phone: phone_INP.value,
    email: email_INP.value,
    message: message_INP.value,
  };

  reviews.push(newReview);

  localStorage.setItem("reviews", JSON.stringify(reviews));

  alert("Message sent successfully!");

  document.getElementById("contact_form").reset();
}

submit_btn.addEventListener("click", saveToLocalStorage);

const form = document.getElementById("contact_form");
let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];


 
for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
        document.getElementById("usernameOut").textContent = users[i].username;
        break; 
    }
}

let logoutBtn = document.getElementById("logoutBtn");


if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "/login/login.html"; 
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