document.addEventListener("DOMContentLoaded", () => {
  const authButtons = document.getElementById("authButtons");
  const token = localStorage.getItem("token");

  if (token) {
    authButtons.classList.add("d-none"); // hide if logged in
  } else {
    authButtons.classList.remove("d-none"); // show if logged out
  }
});