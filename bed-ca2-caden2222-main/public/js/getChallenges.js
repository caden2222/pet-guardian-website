document.addEventListener("DOMContentLoaded", function () {
  // Read login token (if exists) and convert to a simple true/false
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // =========================================================
  // Step 1: Fetch challenges that THIS user created
  // (So we know which cards should show Edit/Delete enabled)
  // =========================================================
  const callbackForMyChallenges = (status, data) => {
    // Default: user has no creator rights (safe fallback)
    const myChallengeIds = new Set();

    // If request succeeded, store all created challenge IDs in a Set
    // (Set makes lookup fast when rendering each challenge)
    if (status === 200 && Array.isArray(data)) {
      data.forEach((row) => myChallengeIds.add(Number(row.challenge_id)));
    }

    // =========================================================
    // Step 2: Fetch ALL challenges and render them
    // Use the Set above to decide if Edit/Delete should be enabled
    // =========================================================
    const callbackForAllChallenges = (responseStatus, responseData) => {
      const challengeTemplate = document.getElementById("challengeTemplate");

      // Optional (recommended): clear first so you don't duplicate cards on reload
      // challengeTemplate.innerHTML = "";

      responseData.forEach((challenge, idx) => {
        const displayItem = document.createElement("div");
        displayItem.className = "col-12 col-md-6 col-lg-4";

        // True if the logged-in user is the creator of this challenge
        const isCreator = myChallengeIds.has(Number(challenge.challenge_id));

        // Build challenge card UI
        displayItem.innerHTML = `
          <div class="card p-3 h-100 d-flex flex-column">

            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-primary">
                 Challenge #${idx + 1}
              </span>
              <span class="small text-muted challenge-points">
                +${challenge.points} pts
              </span>
            </div>

            <p class="mb-3 challenge-desc">${challenge.description}</p>

            <div class="mt-auto d-flex flex-column gap-2">

              <!-- Start / Complete button -->
              <button
                class="btn btn-outline-primary btn-sm w-100 challenge-btn"
                data-state="start"
                data-challenge-id="${challenge.challenge_id}"
                data-creator-id="${challenge.creator_id}"
                ${!isLoggedIn ? "disabled" : ""}
              >
                ${isLoggedIn ? "Start" : "Login to start"}
              </button>

              ${
                // Only show Edit/Delete section when logged in
                isLoggedIn
                  ? `
                    <div class="d-flex gap-2">
                      <!-- Edit: only enabled if user is creator -->
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm w-100 edit-challenge-btn"
                        data-challenge-id="${challenge.challenge_id}"
                        ${!isCreator ? "disabled" : ""}
                      >
                        ${isCreator ? "✏️ Edit" : "🔒 Not yours"}
                      </button>

                      <!-- Delete: only enabled if user is creator -->
                      <button
                        type="button"
                        class="btn btn-outline-danger btn-sm w-100 delete-challenge-btn"
                        data-challenge-id="${challenge.challenge_id}"
                        ${!isCreator ? "disabled" : ""}
                      >
                        ${isCreator ? "🗑️ Delete" : "🔒 Not yours"}
                      </button>
                    </div>
                  `
                  : ""
              }

            </div>
          </div>
        `;

        challengeTemplate.appendChild(displayItem);
      });
    };

    // Fetch and render all challenges (public list)
    fetchMethod(currentUrl + "/api/challenges", callbackForAllChallenges);
  };

  // =========================================================
  // If user is NOT logged in:
  // skip "my challenges" fetch, render everything with no creator rights
  // =========================================================
  if (!isLoggedIn) {
    callbackForMyChallenges(200, []);
    return;
  }

  // =========================================================
  // If logged in:
  // call backend to get challenges created by the current user
  // =========================================================
  fetchMethod(
    currentUrl + "/api/users/badgescreator", 
    callbackForMyChallenges,
    "GET",
    null,
    token
  );
});
