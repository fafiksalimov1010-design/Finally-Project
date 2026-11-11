const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nameInp = document.getElementById("nameInp").value;
        const SurenameInp = document.getElementById("Surename").value;
        const EmailInp = document.getElementById("Email").value;
        const usernameInp = document.getElementById("usernameInp").value;
        const passInp = document.getElementById("passInp").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];


       
        const newUser = {
            name: nameInp,
            Surname: SurenameInp,
            email: EmailInp,
            username: usernameInp,
            password: passInp
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        
        localStorage.setItem("currentUser", usernameInp);

        alert("Account created successfully!");
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

  let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];


for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
        document.getElementById("usernameOut").textContent = users[i].username;
        break; 
    }
}