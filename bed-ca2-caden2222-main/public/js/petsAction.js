document.addEventListener("DOMContentLoaded", function () {
  // Use one click listener for all "Buy" buttons (event delegation)
  document.addEventListener("click", function (e) {
    // Only respond if a pet buy button was clicked
    const btn = e.target.closest(".redeem-pet-btn");
    if (!btn) return;

    // Get pet ID from the button
    const pet_id = btn.dataset.petId;

    // Show loading state so user can’t spam-click
    btn.textContent = "Buying...";
    btn.disabled = true;

    // Helper: show a Bootstrap toast message (success/warning/error)
    function showPetToast(message, type = "warning") {
      const toastEl = document.getElementById("petToast");
      const toastBody = document.getElementById("petToastBody");

      // Update toast style + text, then show it for 4 seconds
      toastEl.className = `toast align-items-center text-bg-${type} border-0`;
      toastBody.textContent = message;

      new bootstrap.Toast(toastEl, { delay: 4000 }).show();
    }

    // Handle backend response from the "buy pet" request
    const callbackForRedeem = (responseStatus, responseData) => {
      // Success: pet purchased
      if (responseStatus === 201) {
        btn.textContent = "Bought ✓";
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-secondary");
        btn.disabled = true;
        const pointsText = document.getElementById("pointsText");
        const pointsEl = document.getElementById("pointsValue");

        if (pointsEl && responseData?.updated_points != null) {
          pointsEl.textContent = responseData.updated_points;
        }
          // If points section was hidden initially, reveal it
          if (pointsText) pointsText.classList.remove("d-none");
        showPetToast("Pet purchased successfully 🐾", "success");
        return;
      }

      // Fail: restore the button so the user can try again
      btn.disabled = false;
      btn.textContent = "Buy";

      // Expected failure: not enough points / forbidden action
      if (responseStatus === 403) {
        showPetToast(
          responseData?.message ||
            "You don’t have enough points to buy this pet.",
          "warning",
        );
        return;
      }

      // Fallback: unexpected server or request error
      showPetToast(
        responseData?.message || responseData?.error || "Pet purchase failed.",
        "danger",
      );
    };

    // Send POST request to backend to buy the pet
    fetchMethod(
      currentUrl + `/api/users/${pet_id}/buy`,
      callbackForRedeem,
      "POST",
      {},
      localStorage.getItem("token"),
    );
  });
});
