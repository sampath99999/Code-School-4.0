$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");
  const username = decodeURIComponent(urlParams.get("username"));
  const userImage = decodeURIComponent(urlParams.get("image"));

  if (!username) {
    window.location.href = "index.html";
  }

  let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];

  function displayMessages() {
    $(".chat-box").empty();
    messages.forEach((entry) => {
      let messageDiv = $("<div></div>").addClass(
        `message ${
          entry.user === username ? "sent" : "received"
        } border-0 bg-transparent mb-2`
      ).html(`
                    <div class="d-flex ${
                      entry.user === username
                        ? "justify-content-end"
                        : "justify-content-start"
                    } align-items-start">
                        ${
                          entry.user !== username
                            ? `
                            <img src="${entry.image}" alt="${entry.user}" class="user-icon rounded-circle me-2"
                                style="width: 40px; height: 40px; object-fit: cover; border: 1px solid #ccc;">
                        `
                            : ""
                        }
                        
                        <div class="message ${
                          entry.user === username ? "sent" : "received bg-light"
                        } p-2 rounded shadow-sm border-1">
                            <span>${entry.text}</span>
                            <small class="d-block text-dark text-end time-stamp">${
                              entry.time
                            }</small>
                        </div>

                        ${
                          entry.user === username
                            ? `
                            <img src="${entry.image}" alt="${entry.user}" class="user-icon rounded-circle ms-2"
                                style="width: 40px; height: 40px; object-fit: cover; border: 1px solid #ccc;">
                        `
                            : ""
                        }
                    </div>
                `);

      $(".chat-box").append(messageDiv);
    });
    $(".chat-box").scrollTop($(".chat-box")[0].scrollHeight);
  }

  displayMessages();

  $("#send").on("click", function () {
    let messageText = $("#messageInput").val().trim();
    if (messageText !== "") {
      let current = new Date();
      let timestamp =
        current.getHours().toString().padStart(2, "0") +
        ":" +
        current.getMinutes().toString().padStart(2, "0");

      let newMessage = {
        userId: userId,
        user: username,
        image: userImage,
        text: messageText,
        time: timestamp,
      };

      messages.push(newMessage);
      localStorage.setItem("chatMessages", JSON.stringify(messages));

      displayMessages();
      $("#messageInput").val("");
    }
  });
});
