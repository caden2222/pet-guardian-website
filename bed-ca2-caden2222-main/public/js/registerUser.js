document.addEventListener("DOMContentLoaded", function () {
  // Grab the form + warning UI elements
  const signupForm = document.getElementById("signupForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  // Small helper to show warning messages neatly
  function showWarning(message) {
    warningCard.classList.remove("d-none");
    warningText.innerText = message;
  }

  // When user submits the signup form
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // prevent page refresh

    // Read input values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic frontend validation (fast feedback for user)
    if (!username || !email || !password || !confirmPassword) {
      showWarning("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      showWarning("Passwords do not match.");
      return;
    }

    // Build request body for backend
    const data = {
      username: username,
      email: email,
      password: password,
    };

    // Handle backend response after register request
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);

      // Success: backend returns token, so store it and redirect user
      if (responseStatus === 200 && responseData.token) {
        localStorage.setItem("token", responseData.token);
        window.location.href = "profile.html";
        return;
      }

      // Fail: show backend error message
      showWarning(responseData?.message || "Registration failed.");
    };

    // Send signup request to backend
    fetchMethod(currentUrl + "/api/register", callback, "POST", data);

    // Clear form after submitting
    signupForm.reset();
  });
});
