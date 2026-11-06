document.addEventListener("DOMContentLoaded", function () {
  const petGrid = document.getElementById("petGrid");

  // =================================================
  // 1) Load and render all pets in the shop
  // =================================================
  const petCallback = (responseStatus, responseData) => {
    // Only continue if backend returns pets successfully
    if (responseStatus !== 200) return;

    // Clear existing UI before re-rendering
    petGrid.innerHTML = "";

    // Build a card for each pet
    responseData.forEach((pet) => {
      const displayItem = document.createElement("div");
      displayItem.className = "col-12 col-md-6 col-lg-4";

      displayItem.innerHTML = `
        <div class="card p-3 h-100">

          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary">Pet #${pet.pet_id}</span>
            <span class="small text-muted">${pet.price_points} pts</span>
          </div>

          <h6 class="mb-1">${pet.name}</h6>
          <p class="text-muted small mb-3">${pet.description}</p>

          <div class="mt-auto">
            <!-- Buy button stores pet_id so click handler knows which pet to buy -->
            <button 
              class="btn btn-outline-primary btn-sm w-100 redeem-pet-btn"
              data-pet-id="${pet.pet_id}"
            >
              Buy
            </button>
          </div>

        </div>
      `;

      petGrid.appendChild(displayItem);
    });

    // After pets are shown, check which pets the user already owns
    const token = localStorage.getItem("token");

    if (token) {
      // Logged in: fetch user's owned pets and disable bought ones
      fetchMethod(
        currentUrl + "/api/users/pets",
        petsByUserCallback,
        "GET",
        null,
        token
      );
    } else {
      // Not logged in: prevent buying and guide user to login
      document.querySelectorAll(".redeem-pet-btn").forEach((btn) => {
        btn.textContent = "Login to buy";
        btn.disabled = true;
      });
    }
  };

  // =================================================
  // 2) Mark pets that the user already owns
  // =================================================
  const petsByUserCallback = (responseStatus, responseData) => {
    if (responseStatus !== 200) return;

    // Put owned pet IDs into a Set for fast lookup
    const ownedSet = new Set(responseData.map((item) => Number(item.pet_id)));

    // Update UI: disable and relabel any pet the user already bought
    document.querySelectorAll(".redeem-pet-btn").forEach((btn) => {
      const petId = Number(btn.dataset.petId);

      if (ownedSet.has(petId)) {
        btn.textContent = "Bought ✓";
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-secondary");
        btn.disabled = true;
      }
    });
  };

  // =================================================
  // 3) Initial fetch: load all pets (shop list)
  // =================================================
  fetchMethod(
    currentUrl + "/api/pets",
    petCallback,
    "GET",
    null,
    localStorage.getItem("token") // token optional; backend can ignore it for public listing
  );
});
