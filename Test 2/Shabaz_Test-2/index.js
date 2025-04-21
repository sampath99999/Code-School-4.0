$(document).ready(function () {
  loadSongs("all", 0);

  let token = localStorage.getItem("admin_token");
  if (!token) {
    showToast(
      "Error",
      "Please log in to access the dashboard.",
      "fa-exclamation-circle",
      "text-danger"
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    return;
  }

  const toastEl = $("#toast");
  const toast = new bootstrap.Toast(toastEl);
  let currentlyPlaying = null;

  $(".nav-link, .dropdown-item").click(function (e) {
    e.preventDefault();
    console.log("Filter clicked:", $(this).data());
    $(".nav-link, .dropdown-item").removeClass("active");
    $(this).addClass("active");

    const filter = $(this).data("filter") || "all";
    const categoryId = $(this).data("category") ?? null; // allow 0 to pass
    loadSongs(filter, categoryId);
  });

  const categoryMap = {
    0: "All Categories",
    1: "Bollywood",
    2: "Tollywood",
    3: "Hollywood",
  };

  function loadSongs(filter = "all", categoryId = null) {
    console.log("Loading songs, filter:", filter, "categoryId:", categoryId);
    $("#loadingIndicator").removeClass("d-none");
    $("#songList").empty();
    $("#noSongs").addClass("d-none");

    // Map the filter to category ID if not already given
    if (filter !== "all" && (categoryId === null || categoryId === undefined)) {
      categoryId =
        filter === "bollywood"
          ? 1
          : filter === "tollywood"
          ? 2
          : filter === "hollywood"
          ? 3
          : null;
    }

    const data = { filter, token: localStorage.getItem("admin_token") };

    // Only set categoryId if it's not 0 (because 0 means "All Categories")
    if (categoryId !== null && categoryId !== 0) {
      data.categoryId = categoryId;
    }

    $.ajax({
      url: "/api/getSongs.php",
      type: "GET",
      data: { categoryId, token: localStorage.getItem("admin_token") },
      dataType: "json",
      success: function (response) {
        console.log("Songs response:", response);
        $("#loadingIndicator").addClass("d-none");
        if (response.success || response.data.length > 0) {
          response.data.forEach((song) => {
            const uploadDate = new Date(song.upload_date).toLocaleDateString();
            const categoryName = categoryMap[song.category_id] || "Unknown";

            const songHtml = `
  <div class="col-md-6 col-lg-4">
      <div class="card song-card h-100" data-id="${song.id}">
          <div class="song-poster position-relative">
              <img src="${song.poster}" alt="${
              song.song_title
            }" class="img-fluid">
              <div class="play-button" data-id="${song.id}">
                  <i class="fas ${
                    currentlyPlaying === song.id ? "fa-pause" : "fa-play"
                  }"></i>
              </div>
              <audio id="audio-${song.id}" src="${song.file_path}"></audio>
          </div>
          <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                  <h5 class="card-title text-truncate mb-1">${
                    song.song_title
                  }</h5>
                  <button class="favorite-button ${
                    song.is_favorite ? "active" : ""
                  }" data-id="${song.id}">
                      <i class="fas fa-heart"></i>
                  </button>
              </div>
              <p class="card-text text-muted text-truncate mb-3">${
                song.artists
              }</p>
              <div class="d-flex justify-content-between align-items-center">
                  <span class="category-badge">${song.description}</span>
                  <small class="text-muted">${uploadDate}</small>
              </div>
          </div>
      </div>
  </div>
`;

            $("#songList").append(songHtml);
          });
        } else {
          $("#noSongs").removeClass("d-none");
        }
      },
      error: function (xhr) {
        console.error("Songs error:", xhr);
        $("#loadingIndicator").addClass("d-none");
        showToast(
          "Error",
          "Failed to load songs: " +
            (xhr.responseJSON?.message || xhr.statusText),
          "fa-exclamation-circle",
          "text-danger"
        );
        if (xhr.status === 401) {
          window.location.href = "login.html";
        }
      },
    });
  }

  $(document).on("click", ".favorite-button", function () {
    const $button = $(this);
    const songId = $button.data("id");
    console.log("Toggling favorite for song:", songId);

    $.ajax({
      url: "/api/toggleFavorite.php",
      type: "POST",
      headers: { Authorization: token },
      data: { song_id: songId },
      dataType: "json",
      success: function (response) {
        console.log("Toggle favorite response:", response);
        if (response.success) {
          $button.toggleClass("active");
          showToast(
            "Success",
            response.message,
            "fa-check-circle",
            "text-success"
          );
        } else {
          showToast(
            "Error",
            response.message,
            "fa-exclamation-circle",
            "text-danger"
          );
        }
      },
      error: function (xhr) {
        console.error("Toggle favorite error:", xhr);
        showToast(
          "Error",
          "Failed to update favorite: " +
            (xhr.responseJSON?.message || xhr.statusText),
          "fa-exclamation-circle",
          "text-danger"
        );
      },
    });
  });

  $(document).on("click", ".play-button", function () {
    const songId = $(this).data("id");
    const audio = document.getElementById(`audio-${songId}`);

    // Pause any other playing songs
    $("audio").each(function () {
      if (this.id !== `audio-${songId}`) {
        this.pause();
        this.currentTime = 0;
        $(
          `.play-button[data-id='${$(this)
            .closest(".song-card")
            .data("id")}'] i`
        )
          .removeClass("fa-pause")
          .addClass("fa-play");
      }
    });

    // Toggle play/pause for clicked song
    if (audio.paused) {
      audio.play();
      $(this).find("i").removeClass("fa-play").addClass("fa-pause");
    } else {
      audio.pause();
      $(this).find("i").removeClass("fa-pause").addClass("fa-play");
    }

    currentlyPlaying = songId;
  });

  $("#uploadForm").on("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      url: "api/uploadSongs.php",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (res) {
        console.log("Server response:", res);
        window.location.reload();
        if (res.status === "success") {
          alert(res.message);
          window.$("#uploadForm")[0].reset();
        } else {
          alert(res.message || "Upload failed.");
        }
      },
      error: function (xhr) {
        console.error("AJAX error:", xhr.responseText);
        try {
          const res = JSON.parse(xhr.responseText);
          alert("Error: " + res.message);
        } catch (err) {
          alert("An unknown error occurred.");
        }
      },
    });
  });

  $("#logoutButton").click(function () {
    console.log("Logout clicked");
    localStorage.removeItem("admin_token");
    window.location.href = "login.html";
  });

  function showToast(title, message, iconClass, iconColorClass) {
    console.log("Showing toast:", title, message);
    $("#toastTitle").text(title);
    $("#toastMessage").text(message);
    $("#toastIcon")
      .removeClass()
      .addClass(`fas ${iconClass} me-2 ${iconColorClass}`);
    toast.show();
  }
});
