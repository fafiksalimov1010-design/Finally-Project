const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
let currentIndex = 0;
let interval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    showSlide(currentIndex);
    resetInterval();
  });
});

function startCarousel() {
  interval = setInterval(nextSlide, 3000); 
}

function resetInterval() {
  clearInterval(interval);
  startCarousel();
}

showSlide(currentIndex);
startCarousel();
















const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const doneEl = document.getElementById("done");

const targetDate = new Date("2026-08-06T00:00:00").getTime();

function updateTimer() {
  const diff = targetDate - Date.now();

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    doneEl.classList.add("show");
    clearInterval(timerId);
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateTimer();
const timerId = setInterval(updateTimer, 1000);

const shopNowBtn = document.querySelectorAll(".Shop__now");
console.log(shopNowBtn);

for (let btn of shopNowBtn) {
  btn.addEventListener("click", () => {
    window.open("/Shop/shop.html");
  });
}

const log_btn = document.getElementById("log_in");

log_btn.addEventListener("click", () => {
  window.open("/login/login.html");
});

const log_btn1 = document.getElementById("log_in1");

log_btn1.addEventListener("click", () => {
  window.open("/login/login.html");
});


const burger_menu = document.getElementById("burger_menu");
const x_icon = document.getElementById("x_icon");
const menu_cover = document.querySelector(".menu_cover");

menu_cover.style.display = "none";

burger_menu.addEventListener("click", () => {
    burger_menu.style.display = "none";
    menu_cover.style.display = "flex";
    document.body.style.overflow = "hidden";
})

x_icon.addEventListener("click", () => {
    burger_menu.style.display = "";
    menu_cover.style.display = "none";
    document.body.style.overflow = "";
})


let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
 
for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
        document.getElementById("usernameOut").textContent = users[i].username;
        break; 
    }
}

