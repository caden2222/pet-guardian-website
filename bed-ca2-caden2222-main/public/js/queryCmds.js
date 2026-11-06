// ============================================================
// FETCH METHOD
// A small helper to standardise all API calls in the frontend.
// - Adds JSON headers automatically
// - Adds JWT token automatically (if provided)
// - Handles 204 (No Content) responses
// - Parses JSON safely (won’t crash if response body is empty)
// - Optionally triggers a global 401 handler (token expired / not logged in)
// ============================================================
function fetchMethod(url, callback, method = "GET", data = null, token = null) {
  // Store request headers here (we only add what we need)
  const headers = {};

  // If we are sending data, tell backend it's JSON
  if (data !== null) {
    headers["Content-Type"] = "application/json";
  }

  // If token exists, attach it for protected routes
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  // Build the fetch options object
  const options = {
    method: method.toUpperCase(),
    headers,
  };

  // Only attach body for non-GET requests
  if (options.method !== "GET" && data !== null) {
    options.body = JSON.stringify(data);
  }

  // Make the request
  fetch(url, options)
    .then((response) => {
      // Some endpoints return 204 (No Content), so there is no JSON to parse
      if (response.status === 204) {
        callback(response.status, {});
        return null; // stop here
      }

      // Try to parse JSON response
      // If parsing fails (e.g. empty body), treat it as {}
      return response
        .json()
        .catch(() => ({}))
        .then((responseData) => {
          // Global auth handling:
          // If a 401 happens, show modal + redirect to login (if function exists)
          if (typeof handleTokenExpired401 === "function") {
            const handled = handleTokenExpired401(response.status, responseData);
            if (handled) return; // stop further handling if modal took over
          }

          // Pass status + data back to the caller
          callback(response.status, responseData);
        });
    })
    .catch((error) => {
      // Network/server failure (fetch didn’t get a valid response)
      console.error(`Error from ${method} ${url}:`, error);
    });
}

// ============================================================
// JQUERY METHOD (optional)
// This section is a placeholder if you want to support $.ajax later.
// ============================================================

// ============================================================
// AXIOS METHOD (optional)
// This section is a placeholder if you want to support axios later.
// ============================================================
