$(document).ready(function () {
  let token = localStorage.getItem("token");
  $.ajax({
    method: "GET",
    url: "API/utils/getSecurityRequests.php",
    headers: {
      authorization: token,
    },
  }).then(
    (response) => {
      let result = JSON.parse(response);
      console.log(result);
      if (result.status != "false") {
        let output = "";
        result.forEach((element) => {
          output += `
                    <tr>
                      <td>${element.guest_name}</td>
                      <td>${element.phone}</td>
                      <td>${element.veichle_number}</td>
                      <td>${element.status}</td>
                    </tr>`;
        });

        $("#approvedLogTableBody").append(output);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Error",
          icon: "error",
        });
      }
    },
    (error) => {
      console.log(error);
    }
  );
});
