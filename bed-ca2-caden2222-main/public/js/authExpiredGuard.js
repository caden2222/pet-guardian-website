// Handles all 401 (Unauthorized) responses related to authentication
function handleTokenExpired401(status, responseData) {
  // Only handle 401 errors, ignore everything else
  if (status !== 401) return false;

  // Get the authentication-expired modal
  const modalEl = document.getElementById("authExpiredModal");
  if (!modalEl) return false;

  // Update the modal message based on the reason for the 401
  const msgEl = modalEl.querySelector(".modal-body");
  if (msgEl) {
    if (responseData?.error === "Invalid token") {
      // Token exists but is expired or invalid
      msgEl.textContent = "Your session has expired. Please login again.";
    } else if (responseData?.error === "No token provided") {
      // User is not logged in at all
      msgEl.textContent = "Please login or register to continue.";
    } else {
      // Fallback message for other auth-related 401s
      msgEl.textContent = "Please login to continue.";
    }
  }

  // Create a modal that the user must acknowledge
  const modal = new bootstrap.Modal(modalEl, {
    backdrop: "static", // prevent closing by clicking outside
    keyboard: false     // prevent closing with Esc key
  });

  // When user clicks OK:
  // - clear token
  // - redirect to login page
  document.getElementById("authExpiredOkBtn").onclick = function () {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  };

  // Show the modal
  modal.show();

  // Signal to caller that the 401 was handled
  return true;
}
