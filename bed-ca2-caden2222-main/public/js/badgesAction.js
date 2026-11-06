document.addEventListener("DOMContentLoaded", function () {

  // Listen for clicks anywhere on the page (event delegation)
  document.addEventListener("click", function (e) {

    // Only react if a "Redeem Badge" button was clicked
    const btn = e.target.closest(".redeem-badge-btn");
    if (!btn) return;

    // Get badge ID from button data attribute
    const badge_id = btn.dataset.badgeId;

    // Give immediate feedback so user knows something is happening
    btn.textContent = "Redeeming...";
    btn.disabled = true;

    // Helper function to show a Bootstrap toast message
    function showRedeemToast(message, type = "warning") {
      const toastEl = document.getElementById("redeemToast");
      const toastBody = document.getElementById("redeemToastBody");

      // Update toast style and message
      toastEl.className = `toast align-items-center text-bg-${type} border-0`;
      toastBody.textContent = message;

      // Show toast for 4 seconds
      const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
      toast.show();
    }

    // Handle response from backend redeem request
    const callbackForRedeem = (responseStatus, responseData) => {

      // Success: badge redeemed
      if (responseStatus === 201) {
        btn.textContent = "Redeemed ✓";
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-secondary");

        showRedeemToast("Badge redeemed successfully 🎉", "success");
        return;
      }

      // Restore button if redeem failed
      btn.disabled = false;
      btn.textContent = "Redeem";

      // Expected failure (e.g. not enough points)
      if (responseStatus === 403) {
        showRedeemToast(responseData.message, "warning");
        return;
      }

      // Fallback for unexpected errors
      showRedeemToast(
        responseData?.message || responseData?.error || "Badge redeem failed",
        "danger",
      );
    };

    // Send POST request to redeem badge
    fetchMethod(
      currentUrl + `/api/users/badges/${badge_id}/redeem`,
      callbackForRedeem,
      "POST",
      {},
      localStorage.getItem("token"),
    );
  });
});
