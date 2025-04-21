$("#logoutBtn").click(function () {
  Swal.fire({
    title: "Logout?",
    text: "Are you sure you want to logout?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout!",
  }).then((result) => {
    if (result.isConfirmed) {
      $("#logoutBtn").html(
        '<span class="spinner-border spinner-border-sm me-1"></span> Logging out...'
      );

      $.ajax({
        url: "/api/Logout.php",
        type: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
        },
        success: function (response) {
          sessionStorage.clear();

          window.location.href = "index.html";
        },
        error: function (xhr) {
          Swal.fire({
            icon: "error",
            title: "Logout Failed",
            text: xhr.responseJSON?.message || "Could not logout properly",
          });
          $("#logoutBtn").html(
            '<i class="fas fa-sign-out-alt me-1"></i> Logout'
          );
        },
      });
    }
  });
});
