$(document).ready(function () {
  let token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
  }

  $.ajax({
    method: "GET",
    url: "API/utils/getFlatNumber.php",
    headers: {
      authorization: token,
    },
  }).then(
    (response) => {
      let result = JSON.parse(response);

      if (result.status != "false") {
        let output = "";
        result.forEach((element) => {
          output += `
          <option value="${element.flat_number}">${element.flat_number}</option>`;
        });

        $("#flat").append(output);
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

  $(".submit").click(function (event) {
    event.preventDefault();
    let name = $("#name").val();
    let phone = $("#phone").val();
    let vehicle = $("#vehicle").val();
    let flat_number = $("#flat").val();
    console.log(flat_number);

    $.ajax({
      method: "POST",
      url: "API/utils/updateGuest.php",
      data: {
        name: name,
        phone: phone,
        vehicle: vehicle,
        flat_number: flat_number,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization: token,
      },
    }).then(
      (response) => {
        let result = JSON.parse(response);
        console.log(result);
        if (result.status != "false") {
          Swal.fire({
            title: "Success!",
            text: "Request Sent Successfully",
            icon: "success",
          });
          $("#name,#phone,#vehicle,#flat").val("");
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to insert guest details",
            icon: "error",
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  });
});
