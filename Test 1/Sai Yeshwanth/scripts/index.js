$(document).ready(function () {
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();

    let username = $("#userName").val().trim();
    let password = $("#password").val().trim();
    let $joinBtn = $("#joinBtn");
    let $errorMessage = $("#errorMessage");

    $errorMessage.hide().text("");

    if (username && password) {
      $joinBtn.prop("disabled", true).html(`
        <span class="spinner-border spinner-border-sm me-2"></span>
    `);

      fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            const encodedUsername = encodeURIComponent(data.username);
            const encodedImage = encodeURIComponent(data.image);
            window.location.href = `chat.html?id=${data.id}&username=${encodedUsername}&image=${encodedImage}`;
          } else {
            $errorMessage
              .text("Invalid username or password.")
              .addClass("text-center")
              .show();
          }
        })
        .catch((error) => {
          $errorMessage.text("Login failed. Please try again.").show();
          console.error("Error:", error);
        })
        .finally(() => {
          $joinBtn.prop("disabled", false).html("Join");
        });
    }
  });
});
