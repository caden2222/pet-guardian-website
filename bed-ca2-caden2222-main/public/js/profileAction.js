document.addEventListener("DOMContentLoaded", function () {
  // =================================================
  // SECTION 1: OWNED PETS (show what the user has bought)
  // =================================================
  const ownedpetsGrid = document.getElementById("ownedPetsGrid");

  // Renders the user's owned pets into cards
  const ownedPetsCallback = (responseStatus, responseData) => {
    if (responseStatus !== 200) return;

    // Clear grid before rendering
    ownedpetsGrid.innerHTML = "";

    responseData.forEach((pet) => {
      const displayItem = document.createElement("div");
      displayItem.className = "col-12 col-md-6 col-lg-4";

      // Build pet card UI (name, cost, description, obtained date)
      displayItem.innerHTML = `
        <div class="card p-3 h-100 text-center">
          <div class="fs-2 mb-2">🐾</div>

          <div class="fw-semibold mb-1">
            ${pet.name}
          </div>

          <span class="badge bg-light text-muted border mb-2">
            ${pet.price_points} pts
          </span>

          <p class="text-muted small mb-1">
            ${pet.description}
          </p>

          <p class="text-muted small mb-0">
            Obtained on ${new Date(pet.obtained_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      `;

      ownedpetsGrid.appendChild(displayItem);
    });
  };

  // Fetch pets owned by the logged-in user
  fetchMethod(
    currentUrl + "/api/users/pets",
    ownedPetsCallback,
    "GET",
    null,
    localStorage.getItem("token"),
  );

  // =================================================
  // SECTION 2: OWNED BADGES (show badges the user earned)
  // =================================================
  const ownedBadgesGrid = document.getElementById("ownedBadgesGrid");

  // Renders the user's earned badges into cards
  const ownedBadgesCallback = (responseStatus, responseData) => {
    if (responseStatus !== 200) return;

    ownedBadgesGrid.innerHTML = "";

    responseData.forEach((badge) => {
      const div = document.createElement("div");
      div.className = "col-12";

      // Badge type label (depends on requirement type)
      const requirementLabel =
        badge.requirement_type === "distinct"
          ? "Distinct Activities"
          : "Total Challenges";

      // Badge styling (different look for each type)
      const requirementBadgeClass =
        badge.requirement_type === "distinct"
          ? "bg-info-subtle text-info border"
          : "bg-success-subtle text-success border";

      // Build badge card UI (name, description, requirement, earned date)
      div.innerHTML = `
        <div class="card p-4 h-100 border-0 shadow-sm rounded-4">

          <!-- top row: badge id + requirement -->
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary rounded-pill px-3 py-2">
              Badge #${badge.badge_id}
            </span>
            <span class="badge ${requirementBadgeClass} mb-3 rounded-pill px-3 py-2">
              ${badge.challenges_needed} ${requirementLabel}
            </span>
          </div>

          <!-- title -->
          <h5 class="mb-2">
            ${badge.name}
          </h5>

          <!-- description -->
          <p class="text-muted mb-2">
            ${badge.description}
          </p>

          <!-- earned date -->
          <p class="text-muted small mb-3">
            Earned on ${new Date(badge.earned_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          <!-- disabled button just to show status -->
          <button class="btn btn-outline-primary w-100 mt-auto" disabled>
            Earned ✓
          </button>

        </div>
      `;

      ownedBadgesGrid.appendChild(div);
    });
  };

  // Fetch badges owned by the logged-in user
  fetchMethod(
    currentUrl + "/api/users/badges",
    ownedBadgesCallback,
    "GET",
    null,
    localStorage.getItem("token"),
  );

  // =================================================
  // SECTION 3: PROFILE STATS (counts for dashboard)
  // =================================================

  // Pets owned count
  const statPetsOwned = document.getElementById("statPetsOwned");
  const petCountCallback = (responseStatus, responseData) => {
    if (responseStatus !== 200) return;
    statPetsOwned.textContent = responseData.pet_count;
  };

  fetchMethod(
    currentUrl + "/api/users/petscount",
    petCountCallback,
    "GET",
    null,
    localStorage.getItem("token"),
  );

  // Badges owned count
  const statBadgesOwned = document.getElementById("statBadges");
  const badgeCountCallback = (responseStatus, responseData) => {
    if (responseStatus !== 200) return;
    statBadgesOwned.textContent = responseData.badge_count;
  };

  fetchMethod(
    currentUrl + "/api/users/badgescount",
    badgeCountCallback,
    "GET",
    null,
    localStorage.getItem("token"),
  );

  // Challenges completed count
  const statChallengesDone = document.getElementById("statChallengesDone");
  const challengesDoneCallback = (responseStatus, responseData) => {
    if (responseStatus !== 200) return;
    statChallengesDone.textContent = responseData.challenge_count;
  };

  fetchMethod(
    currentUrl + "/api/users/challengescount",
    challengesDoneCallback,
    "GET",
    null,
    localStorage.getItem("token")
  );

  // Distinct challenges completed count
  const distinctChallengesDone = document.getElementById('statDistinctChallenges')
  const distinctChallengesDoneCallback = (responseStatus, responseData) => {
    if(responseStatus!==200) return;
    distinctChallengesDone.textContent = responseData.challenge_count
  }

  fetchMethod(
    currentUrl + "/api/users/challengesdistinctcount",
    distinctChallengesDoneCallback,
    "GET",
    null,
    localStorage.getItem("token")
  )

  // =================================================
  // SECTION 4: ACTIVITY FEED (challenge completions history)
  // =================================================
  const activityList = document.getElementById("activityList");

  // Renders a list of completed challenges (history log)
  const callbackForChallengeCompletion = (responseStatus, responseData) => {
    if (responseStatus !== 200) return;

    // Clear existing activity list before adding new items
    activityList.innerHTML = "";

    responseData.forEach((item) => {
      // Add one completion card per activity
      activityList.innerHTML += `
        <div class="card p-4 h-100 border border-2 shadow-sm rounded-4">

          <!-- header: label + completion id -->
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-success rounded-pill px-3 py-2">
              Challenge
            </span>
            <span class="badge bg-dark text-light rounded-pill px-3 py-2">
              #${item.challenge_id}
            </span>
          </div>

          <!-- challenge summary -->
          <h5 class="mb-2">
            ${item.description}
          </h5>

          <!-- user details / reflection -->
          <p class="text-muted mb-2">
            ${item.details ?? "No additional details provided."}
          </p>

          <!-- completion date -->
          <p class="text-muted mb-3">
            Completed on ${new Date(item.completed_date).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          <!-- points earned (display only) -->
          <button class="btn btn-outline-success w-100 mt-auto" disabled>
            🪙 ${item.points} Points Earned ✓
          </button>

        </div>
      `;
    });
  };

  // Fetch the user's challenge completion history
  fetchMethod(
    currentUrl + "/api/users/challenges",
    callbackForChallengeCompletion,
    "GET",
    null,
    localStorage.getItem("token"),
  );
});
