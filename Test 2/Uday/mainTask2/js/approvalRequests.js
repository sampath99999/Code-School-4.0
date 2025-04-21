$(document).ready(function (event) {
  let token = localStorage.getItem("token");

  $.ajax({
    method: "GET",
    url: "API/utils/getRequests.php",
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
          if (element.status == "Pending") {
            output += `
                <tr>
                  <td>${element.guest_name}</td>
                  <td>${element.phone}</td>
                  <td>${element.veichle_number}</td>
                  <td>${element.status}</td>
                  <td>
                    <button class="btn btn-primary border-0 rounded-0 btn bg-primary text-light w-20 approved"
                        style="width:100px" data-id="${element.guest_id}">Approve</button>
                    <button style="width:100px" class="btn border-0 rounded-0 bg-danger text-light w-20 rejected" 
                        data-id="${element.guest_id}">Reject</button>
                  </td>
                </tr>`;
          }
        });

        $("#approvedTableBody").append(output);
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

  
  $(document).on("click", ".approved", function () {
    let requestId = $(this).data("id");
    console.log(requestId);

    $.ajax({
      method: "POST",
      url: "./API/utils/updateStatus.php",
      data: {
        id: requestId,
      },
      headers: {
        Authorization: token,
      },
    }).then(
      (response) => {
        const result = JSON.parse(response);
        if (result.status != "false") {
          location.reload();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  });

  $(document).on("click", ".rejected", function () {
    let requestId = $(this).data("id");
    console.log(requestId);

    $.ajax({
      method: "POST",
      url: "./API/utils/rejectStatus.php",
      data: {
        id: requestId,
      },
      headers: {
        Authorization: token,
      },
    }).then(
      (response) => {
        const result = JSON.parse(response);
        location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  });
});
