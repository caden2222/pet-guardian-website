document.addEventListener("DOMContentLoaded", function () {
  const badgeGrid = document.getElementById("badgeGrid");

  // =================================================
  // 1) Load and render all available badges
  // =================================================
  const badgesCallback = (responseStatus, responseData) => {
    // Only proceed if badges are fetched successfully
    if (responseStatus !== 200) return;

    // Clear existing badges before rendering
    badgeGrid.innerHTML = "";

    // Render each badge as a card
    responseData.forEach((badge) => {
      const div = document.createElement("div");
      div.className = "col-12 col-md-6 col-lg-4";

      // Decide label and colour based on badge requirement type
      const requirementLabel =
        badge.requirement_type === "distinct"
          ? "Distinct Activities"
          : "Total Challenges";

      const requirementBadgeClass =
        badge.requirement_type === "distinct" ? "bg-info" : "bg-success";

      // Build badge card UI
      div.innerHTML = `
        <div class="card p-3 h-100">

          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-primary">Badge #${badge.badge_id}</span>
            <span class="badge ${requirementBadgeClass}">
              ${requirementLabel}
            </span>
          </div>

          <h6 class="mb-1">${badge.name}</h6>
          <p class="text-muted small mb-3">${badge.description}</p>

          <div class="small text-muted mb-3">
            Need: <strong>${badge.challenges_needed}</strong>
          </div>

          <div class="mt-auto">
            <button
              class="btn btn-outline-primary btn-sm w-100 redeem-badge-btn"
              data-badge-id="${badge.badge_id}"
            >
              Redeem
            </button>
          </div>

        </div>
      `;

      badgeGrid.appendChild(div);
    });

    // After rendering all badges, check which ones the user has already redeemed
    const token = localStorage.getItem("token");

    if (token) {
      fetchMethod(
        currentUrl + "/api/users/badges",
        badgesByUserCallback,
        "GET",
        null,
        token,
      );
    } else {
      // If user is not logged in, disable all redeem buttons
      document.querySelectorAll(".redeem-badge-btn").forEach((btn) => {
        btn.textContent = "Login to redeem";
        btn.disabled = true;
      });
    }
  };

  // =================================================
  // 2) Mark badges that the user has already redeemed
  // =================================================
  const badgesByUserCallback = (responseStatus, responseData) => {
    if (responseStatus !== 200) return;

    // Convert redeemed badge IDs into a Set for fast lookup
    const redeemedSet = new Set(responseData.map((b) => Number(b.badge_id)));

    // Disable and update buttons for redeemed badges
    document.querySelectorAll(".redeem-badge-btn").forEach((btn) => {
      const badgeId = Number(btn.dataset.badgeId);

      if (redeemedSet.has(badgeId)) {
        btn.textContent = "Redeemed ✓";
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-secondary");
        btn.disabled = true;
      }
    });
  };

  // =================================================
  // 3) Initial fetch: load all badges
  // =================================================
  fetchMethod(currentUrl + "/api/badges", badgesCallback);
});
