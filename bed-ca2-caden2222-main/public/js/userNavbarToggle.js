document.addEventListener("DOMContentLoaded", function () {
  // Grab navbar buttons + points display (if they exist on this page)
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");
  const pointsText = document.getElementById("pointsText");
  const pointsValue = document.getElementById("pointsValue");

  // Check if the user is logged in (token stored in localStorage)
  const token = localStorage.getItem("token");

  if (token) {
    // ✅ Logged in: hide login/register, show profile/logout
    loginButton.classList.add("d-none");
    registerButton.classList.add("d-none");
    profileButton.classList.remove("d-none");
    logoutButton.classList.remove("d-none");

    // Show points section (if this page has it)
    if (pointsText) pointsText.classList.remove("d-none");

    // Fetch the user's current points and display them
    const callbackForPoints = (responseStatus, responseData) => {
      if (responseStatus !== 200) return;

      // Backend returns an array, so we read index 0
      if (pointsValue) pointsValue.textContent = responseData[0].points;
    };

    fetchMethod(`/api/users/me`, callbackForPoints, "GET", null, token);
  } else {
    // ❌ Not logged in: show login/register, hide profile/logout
    loginButton.classList.remove("d-none");
    registerButton.classList.remove("d-none");
    profileButton.classList.add("d-none");
    logoutButton.classList.add("d-none");

    // Hide points section for guests
    pointsText?.classList.add("d-none");
    if (pointsValue) pointsValue.textContent = "0";
  }

  // Logout button: clear token and return to home page
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});
