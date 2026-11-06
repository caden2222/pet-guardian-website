document.addEventListener("DOMContentLoaded", function () {
  // Grab the form + warning UI elements
  const loginForm = document.getElementById("loginForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  // Handles the backend response after login request
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    // Success: store token so user stays logged in, then go to profile page
    if (responseStatus === 200 && responseData.token) {
      localStorage.setItem("token", responseData.token);
      window.location.href = "profile.html";
      return;
    }

    // Fail: show warning message on the page
    warningCard.classList.remove("d-none");
    warningText.innerText = responseData.message || "Login failed.";
  };

  // When user submits the login form
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop page refresh

    // Hide old warning message before attempting login again
    warningCard.classList.add("d-none");

    // Collect user input (trim username to avoid accidental spaces)
    const data = {
      username: document.getElementById("username").value.trim(),
      password: document.getElementById("password").value,
    };

    // Send login request to backend
    fetchMethod(currentUrl + "/api/login", callback, "POST", data);

    // Clear the form fields after submitting
    loginForm.reset();
  });
});
