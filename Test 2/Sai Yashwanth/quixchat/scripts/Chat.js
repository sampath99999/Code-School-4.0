$(document).ready(function () {
  window.addEventListener("pageshow", () => {
    if (!sessionStorage.getItem("auth_token")) {
      let timerInterval;
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        html: "Unauthorized! <br> Redirecting in <b></b> seconds...",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: () => {
          const b = Swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(() => {
        window.location.href = "../index.html";
      });
    }
  });



  const authToken = sessionStorage.getItem("auth_token");
  // const userId = sessionStorage.getItem("user_id");
  const username = sessionStorage.getItem("username");
  // const userImage = sessionStorage.getItem("user_image");

  if (username) {
    document.getElementById("usernameDisplay").textContent = "Hey, " + username;
  }


  if (!authToken) {
    window.location.href = "index.html";
  }

  function formatTimestamp(timestamp) {
    const current = new Date(timestamp);
    return (
      current.getHours().toString().padStart(2, "0") +
      ":" +
      current.getMinutes().toString().padStart(2, "0")
    );
  }

  $(document).on("click", ".image-preview img", function () {
    const filePath = $(this).attr("src");
    $("#fileModalContent").html(`<img src="${filePath}" class="img-fluid">`);
    $("#fileModal").modal("show");
  });

  function displayMessages(messages) {
    $(".chat-box").empty();
    messages.forEach((entry) => {
      let filePreview = "";
      const fileType = entry.file_type || "";
      const filePath = entry.file_path || "";
      const fileName = entry.file_name || "";

      if (fileType.startsWith("image/")) {
        filePreview = `
        <div class="file-preview image-preview">
          <img src="${filePath}" class="img-fluid rounded my-2" style="max-width: 140px; cursor: pointer;">
        </div>`;
      } else if (fileType.startsWith("video/")) {
        filePreview = `
        <div class="file-preview video-preview">
          <video controls class="my-2" style="max-width: 250px;">
            <source src="${filePath}" type="${fileType}">
            Your browser doesn't support videos.
          </video>
          <a href="${filePath}" download="${fileName}" class="d-block small text-muted mt-1">
            <i class="fas fa-download"></i> Download video
          </a>
        </div>`;
      } else if (fileType.startsWith("audio/")) {
        filePreview = `
        <div class="file-preview audio-preview">
          <audio controls class="my-2 w-100">
            <source src="${filePath}" type="${fileType}">
            Your browser doesn't support audio.
          </audio>
          <a href="${filePath}" download="${fileName}" class="d-block small text-muted mt-1">
            <i class="fas fa-download"></i> Download audio
          </a>
        </div>`;
      } else if (fileType) {
        filePreview = `
        <div class="file-preview document-preview">
          <a href="${filePath}" download="${fileName}" 
             class="d-block text-primary text-decoration-none my-2 p-2 bg-primary-subtle rounded" 
             target="_blank">
            <i class="fa fa-file"></i> ${fileName}
          </a>
        </div>`;
      }

      let messageDiv = $("<div></div>")
        .addClass(
          `message ${entry.username === username ? "sent" : "received"
          } border-0 bg-transparent mb-2`
        )
        .html(
          `<div class="d-flex flex-column ${entry.username === username
            ? "align-items-end"
            : "align-items-start"
          }">

            <div class="d-flex ${entry.username === username
            ? "justify-content-end"
            : "justify-content-start"
          } align-items-start">
              ${entry.username !== username
            ? `<img src="${entry.profile_image}" alt="${entry.username}" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: contain; border: 1px solid #ccc;">`
            : ""
          }

              <div class="message ${entry.username === username ? "sent" : "received bg-light"
          } p-2 rounded shadow-sm border-1">
                  <small class="d-block ${entry.username === username ? "text-primary" : "text-danger"
          }">${entry.username}</small>
                  <span>${entry.message_text}</span>
                  ${filePreview}
                  <small class="d-block text-dark text-end time-stamp">${formatTimestamp(
            entry.created_at
          )}</small>
              </div>

              ${entry.username === username
            ? `<img src="${entry.profile_image}" alt="${entry.username}" class="user-icon rounded-circle ms-2" style="width: 40px; height: 40px; object-fit: contain; border: 1px solid #ccc;">`
            : ""
          }

            </div>

        </div>`
        );

      $(".chat-box").append(messageDiv);
    });
    $(".chat-box").scrollTop($(".chat-box")[0].scrollHeight);
  }

  function fetchMessages() {
    $.ajax({
      method: "GET",
      url: "/api/FetchMessages.php",
      headers: { Authorization: "Bearer " + authToken },
      dataType: "json",
      success: function (response) {
        if (response.status === 200) {
          displayMessages(response.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch messages.",
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to fetch messages. Please try again.",
        });
      },
    });
  }

  $("#chatForm").submit(function (event) {
    event.preventDefault();

    const messageText = $("#messageInput").val().trim();
    const fileInput = $("#fileInput")[0].files[0];

    if (!messageText && !fileInput) return;

    const formData = new FormData();
    formData.append("message_text", messageText);
    if (fileInput) {
      formData.append("file", fileInput);
    }

    $.ajax({
      method: "POST",
      url: "/api/SendMessage.php",
      headers: {
        Authorization: "Bearer " + authToken,
      },
      processData: false,
      contentType: false,
      data: formData,
      success: function (response) {
        if (response.status === 200) {
          fetchMessages();
          $("#messageInput").val("");
          $("#fileInput").val("");
          $("#filePreviewContainer").hide().empty();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.message || "Failed to send message.",
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to send message. Please try again.",
        });
      },
    });
  });

  fetchMessages();
});
