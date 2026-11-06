document.addEventListener("DOMContentLoaded", function () {
  // =========================================================
  // 1) COMPLETE CHALLENGE (open modal -> submit details -> POST)
  // =========================================================

  // We store the button the user clicked so we know which challenge to complete
  let pendingBtn = null;

  // Bootstrap modal setup (challenge completion details)
  const modalEl = document.getElementById("detailsModal");
  const modal = new bootstrap.Modal(modalEl);

  const detailsInput = document.getElementById("detailsInput");
  const submitDetailsBtn = document.getElementById("submitDetailsBtn");

  // When user clicks "Start", we switch the button into "Complete" mode
  window.startChallenge = function (btn) {
    btn.dataset.state = "complete";
    btn.textContent = "Complete";
    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-success");
  };

  // When user clicks "Complete", we open the modal (instead of redeeming immediately)
  window.completeChallenge = function (btn) {
    pendingBtn = btn;
    detailsInput.value = ""; // reset any previous input
    modal.show();
  };

  // When user confirms in the modal, we send the completion request to backend
  submitDetailsBtn.addEventListener("click", function () {
    if (!pendingBtn) return;

    const challenge_id = pendingBtn.dataset.challengeId;
    const details = detailsInput.value.trim();

    // Give instant UI feedback while request runs
    pendingBtn.textContent = "Completing...";
    pendingBtn.disabled = true;

    // Body matches backend expected field name
    const redeemBody = { details };

    const callbackForRedeem = (responseStatus, responseData) => {
      // Success: show completed state + update points
      if (responseStatus === 201) {
        pendingBtn.textContent = "Completed ✓";
        pendingBtn.classList.remove("btn-success", "btn-outline-primary");
        pendingBtn.classList.add("btn-secondary");

        // Update points shown in UI (if backend returns updated_points)
        const pointsText = document.getElementById("pointsText");
        const pointsEl = document.getElementById("pointsValue");

        if (pointsEl && responseData?.updated_points != null) {
          pointsEl.textContent = responseData.updated_points;

          // If points section was hidden initially, reveal it
          if (pointsText) pointsText.classList.remove("d-none");
        }

        // Close the modal after success
        modal.hide();

        // After a short delay, reset the button back to "Start"
        setTimeout(function () {
          pendingBtn.disabled = false;
          pendingBtn.dataset.state = "start";
          pendingBtn.textContent = "Start";
          pendingBtn.classList.remove("btn-secondary", "btn-success");
          pendingBtn.classList.add("btn-outline-primary");
          pendingBtn = null;
        }, 1200);

        return;
      }

      // Fail: revert button and show error
      pendingBtn.disabled = false;
      pendingBtn.textContent = "Complete";
      alert(responseData?.message || responseData?.error);
    };

    // POST completion to backend
    fetchMethod(
      currentUrl + `/api/challenges/${challenge_id}`,
      callbackForRedeem,
      "POST",
      redeemBody,
      localStorage.getItem("token"),
    );
  });

  // One click handler for all challenge buttons (Start/Complete)
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".challenge-btn");
    if (!btn) return;

    if (btn.dataset.state === "start") startChallenge(btn);
    else completeChallenge(btn);
  });

  // =========================================================
  // 2) EDIT CHALLENGE (open modal -> PUT -> update UI)
  // =========================================================

  const editModalEl = document.getElementById("editChallengeModal");
  const editModal = editModalEl ? new bootstrap.Modal(editModalEl) : null;

  const editChallengeIdInput = document.getElementById("editChallengeId");
  const editChallengeDescInput = document.getElementById("editChallengeDesc");
  const editChallengePointsInput = document.getElementById("editChallengePoints");
  const saveChallengeBtn = document.getElementById("saveChallengeBtn");
  const editChallengeError = document.getElementById("editChallengeError");

  // Store which edit button was clicked so we can update that card after saving
  let editingBtn = null;

  // Open edit modal when clicking the ✏️ Edit button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".edit-challenge-btn");
    if (!btn) return;
    if (!editModal) return;

    editingBtn = btn;

    const challenge_id = btn.dataset.challengeId;

    // Read current values from the card so modal is pre-filled
    const card = btn.closest(".card");
    const descEl = card ? card.querySelector(".challenge-desc") : null;
    const pointsEl = card ? card.querySelector(".challenge-points") : null;

    const currentDesc = descEl ? descEl.textContent.trim() : "";
    const currentPoints = pointsEl
      ? Number(pointsEl.textContent.replace(/[^\d]/g, "")) || 0
      : 0;

    // Fill modal fields
    editChallengeIdInput.value = challenge_id;
    editChallengeDescInput.value = currentDesc;
    if (editChallengePointsInput) editChallengePointsInput.value = currentPoints;

    // Reset error UI
    editChallengeError.classList.add("d-none");
    editChallengeError.textContent = "";

    editModal.show();
  });

  // Save changes -> PUT request
  if (saveChallengeBtn) {
    saveChallengeBtn.addEventListener("click", function () {
      const token = localStorage.getItem("token");
      const challenge_id = editChallengeIdInput.value;

      const newDesc = editChallengeDescInput.value.trim();
      const newPoints = Number(editChallengePointsInput ? editChallengePointsInput.value : NaN);

      // Clear previous errors
      editChallengeError.classList.add("d-none");
      editChallengeError.textContent = "";

      // Frontend validations (fast feedback before calling backend)
      if (!newDesc) {
        editChallengeError.textContent = "Description is required.";
        editChallengeError.classList.remove("d-none");
        return;
      }

      if (newDesc.length < 5) {
        editChallengeError.textContent = "Description is too short.";
        editChallengeError.classList.remove("d-none");
        return;
      }

      if (!newPoints || Number.isNaN(newPoints) || newPoints < 1) {
        editChallengeError.textContent = "Points must be at least 1.";
        editChallengeError.classList.remove("d-none");
        return;
      }

      if (newPoints > 50) {
        editChallengeError.textContent = "Points cannot exceed 50.";
        editChallengeError.classList.remove("d-none");
        return;
      }

      // Disable button while saving
      saveChallengeBtn.disabled = true;
      saveChallengeBtn.textContent = "Saving...";

      const callbackForEdit = (responseStatus, responseData) => {
        saveChallengeBtn.disabled = false;
        saveChallengeBtn.textContent = "Save";

        // Success: update the card immediately (no reload needed)
        if (responseStatus === 200) {
          const card = editingBtn ? editingBtn.closest(".card") : null;
          const descEl = card ? card.querySelector(".challenge-desc") : null;
          const pointsEl = card ? card.querySelector(".challenge-points") : null;

          if (descEl) descEl.textContent = newDesc;
          if (pointsEl) pointsEl.textContent = `+${newPoints} pts`;

          editingBtn = null;
          editModal.hide();
          return;
        }

        // Fail: show backend error message
        editChallengeError.textContent =
          responseData?.message || responseData?.error || "Update failed";
        editChallengeError.classList.remove("d-none");
      };

      fetchMethod(
        currentUrl + `/api/challenges/${challenge_id}`,
        callbackForEdit,
        "PUT",
        { description: newDesc, points: newPoints },
        token,
      );
    });
  }

  // =========================================================
  // 3) DELETE CHALLENGE (open modal -> DELETE -> remove card)
  // =========================================================

  const deleteModalEl = document.getElementById("deleteChallengeModal");
  const deleteModal = deleteModalEl ? new bootstrap.Modal(deleteModalEl) : null;


  const deleteChallengeError = document.getElementById("deleteChallengeError");
  const confirmDeleteChallengeBtn = document.getElementById("confirmDeleteChallengeBtn");

  // Store the delete button we clicked so we can remove the correct card
  let deletingBtn = null;

  // Open delete confirmation modal when clicking 🗑️ Delete
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".delete-challenge-btn");
    if (!btn) return;
    if (!deleteModal) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }

    deletingBtn = btn;

    const challenge_id = btn.dataset.challengeId;

    // Show which challenge is being deleted

    // Reset modal error
    if (deleteChallengeError) {
      deleteChallengeError.classList.add("d-none");
      deleteChallengeError.textContent = "";
    }

    // Save id on confirm button so we can access it on confirm click
    confirmDeleteChallengeBtn.dataset.challengeId = challenge_id;

    deleteModal.show();
  });

  // Confirm delete -> send DELETE request
  if (confirmDeleteChallengeBtn) {
    confirmDeleteChallengeBtn.addEventListener("click", function () {
      const token = localStorage.getItem("token");
      const challenge_id = confirmDeleteChallengeBtn.dataset.challengeId;

      if (!token) {
        if (deleteChallengeError) {
          deleteChallengeError.textContent = "Please login first.";
          deleteChallengeError.classList.remove("d-none");
        }
        return;
      }

      confirmDeleteChallengeBtn.disabled = true;
      confirmDeleteChallengeBtn.textContent = "Deleting...";

      const callbackForDelete = (responseStatus, responseData) => {
        confirmDeleteChallengeBtn.disabled = false;
        confirmDeleteChallengeBtn.textContent = "Delete";

        // Success: remove the card from UI and close modal
        if (responseStatus === 200 || responseStatus === 204) {
          const col = deletingBtn
            ? deletingBtn.closest(".col-12") || deletingBtn.closest(".col")
            : null;

          if (col) col.remove();

          deletingBtn = null;
          deleteModal.hide();

          // Optional: refresh page (not required if UI updates are correct)
          location.reload();
          return;
        }

        // Fail: show error in modal
        if (deleteChallengeError) {
          deleteChallengeError.textContent =
            responseData?.message || responseData?.error || "Delete failed";
          deleteChallengeError.classList.remove("d-none");
        }
      };

      fetchMethod(
        currentUrl + `/api/challenges/${challenge_id}`,
        callbackForDelete,
        "DELETE",
        null,
        token,
      );
    });
  }

  // =========================================================
  // 4) POST CHALLENGE (open modal -> validate -> POST -> toast)
  // =========================================================

  const postBtn = document.getElementById("postChallengeBtn");
  const postModalEl = document.getElementById("postChallengeModal");
  const token = localStorage.getItem("token");

  // If not logged in, disable posting
  if (postBtn && !token) {
    postBtn.textContent = "🔒 Login to add challenges";
    postBtn.disabled = true;
    postBtn.classList.add("btn-outline-light");
    postBtn.classList.remove("btn-warning");
  }

  if (postBtn && postModalEl) {
    const postModal = new bootstrap.Modal(postModalEl);

    const descInput = document.getElementById("challengeDescInput");
    const pointsInput = document.getElementById("challengePointsInput");
    const submitPostBtn = document.getElementById("submitPostChallengeBtn");
    const errorEl = document.getElementById("postChallengeError");

    // Prevent double-posting if user clicks submit repeatedly
    let isPosting = false;

    // Open the create challenge modal
    postBtn.addEventListener("click", () => {
      postModal.show();
      errorEl.classList.add("d-none");
    });

    // Submit new challenge -> POST request
    submitPostBtn.addEventListener("click", () => {
      if (isPosting) return;

      const description = descInput.value.trim();
      const points = Number(pointsInput.value);

      // Frontend validations
      if (!description) {
        errorEl.textContent = "Description is required.";
        errorEl.classList.remove("d-none");
        return;
      }

      if (description.length < 5) {
        errorEl.textContent = "Description is too short.";
        errorEl.classList.remove("d-none");
        return;
      }

      if (!points) {
        errorEl.textContent = "Points are required.";
        errorEl.classList.remove("d-none");
        return;
      }

      if (points > 50) {
        errorEl.textContent = "Points cannot exceed 50.";
        errorEl.classList.remove("d-none");
        return;
      }

      // Lock submit button while request runs
      isPosting = true;
      submitPostBtn.disabled = true;

      const callbackForChallenge = (responseStatus, responseData) => {
        isPosting = false;
        submitPostBtn.disabled = false;

        // Success: close modal + show toast
        if (responseStatus === 201) {
          postModal.hide();
          const toastEl = document.getElementById("successToast");
          const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
          toast.show();
          this.location.reload()
          return;
        }

        // Fail: show backend error
        errorEl.textContent =
          responseData?.message || responseData?.error || "Post failed";
        errorEl.classList.remove("d-none");
      };

      fetchMethod(
        "/api/challenges",
        callbackForChallenge,
        "POST",
        { description, points },
        token,
      );
    });
  }
});
