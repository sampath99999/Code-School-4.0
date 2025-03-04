const jsonData = {
  table: [
    {
      "S.No": 1,
      "Job Id": 1001,
      Role: "Frontend Developer",
      Skills: "HTML,CSS,JavaScript and Bootstrap",
      Status: "Apply",
    },
    {
      "S.No": 2,
      "Job Id": 1002,
      Role: "Senior Developer",
      Skills: "Problem Solving,Technical,Soft Skills and DataBase",
      Status: "Apply",
    },
    {
      "S.No": 3,
      "Job Id": 1003,
      Role: "Software Engineer(Java)",
      Skills: "Java,Core-Java,Adv-Java,SpringBoot and DataBase",
      Status: "Apply",
    },
    {
      "S.No": 4,
      "Job Id": 1004,
      Role: "Software Testing",
      Skills: "Manual testing,Automation testing,Agile testing and SDLC",
      Status: "Apply",
    },
    {
      "S.No": 5,
      "Job Id": 1005,
      Role: "DevOps",
      Skills:
        "Linux fundamentals,Continuous integration,Scripting and Automation",
      Status: "Apply",
    },
    {
      "S.No": 6,
      "Job Id": 1006,
      Role: "Analyst",
      Skills: "Data visualization,Problem solving and Collaboration",
      Status: "Apply",
    },
    {
      "S.No": 7,
      "Job Id": 1007,
      Role: "Backend Developer",
      Skills: "Java/Python/Php,Version control systems and CI/CD pipelines",
      Status: "Apply",
    },
    {
      "S.No": 8,
      "Job Id": 1008,
      Role: "Business Analyst",
      Skills: "Analytical thinking,Communication and Data analysis",
      Status: "Apply",
    },
    {
      "S.No": 9,
      "Job Id": 1009,
      Role: "Digital Marketing",
      Skills: "Email marketing,Content marketing,Advertising and Social media",
      Status: "Apply",
    },
    {
      "S.No": 10,
      "Job Id": 1010,
      Role: "Data Science",
      Skills:
        "Data visualization,Statistics,Machine learning,SQL and Natural language processing",
      Status: "Apply",
    },
  ],
};

function populateTable() {
  const tableBody = document.querySelector("#jobTable tbody");
  jsonData.table.forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
        <th scope="row">${row["S.No"]}</th>
        <td>${row["Job Id"]}</td>
        <td>${row.Role}</td>
        <td>${row.Skills}</td>
        <td><button class="btn btn-success" onclick="applyJob(this)">Apply</button></td>
      `;
    tableBody.appendChild(tableRow);
    // tableBody.prepend(tableRow);
  });
  //for key up
  $(document).ready(function(){
    $('#filter-inp').on('keyup',function () {
      // console.log('clicked')
      const inp_filter = $(this).val().toLowerCase();
      $("#tableBody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(inp_filter) > -1);
      });
    });
  });
  //for search button
  $(document).ready(function(){
    $('#filter-button').on('click',function () {
      const inp_filter = $('#filter-inp').val().toLowerCase();
      $("#tableBody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(inp_filter) > -1);
      });
    });
  })
}

function applyJob(button) {
  Swal.fire({
    title: "Good job!",
    text: "You applied successfully!",
    icon: "success",
  }).then(() => {
    const row = button.closest("tr");
    row.remove(); // Remove the row after clicking OK in Swal
  });
  // const row = button.closest("tr");
  // row.remove();
  // document.getElementById("message").innerText = "Applied successfully!";
  //   const cell = button.parentElement;
  //   cell.innerHTML = "Applied successfully";
}

document.getElementById("addJob").addEventListener("click", function (event) {
  event.preventDefault();

  const sNo = document.getElementById("sNo").value;
  const jobId = document.getElementById("jobId").value;
  const role = document.getElementById("jobRole").value;
  const skills = document.getElementById("skills").value;
  const jobStatus = document.getElementById("status").value;

  // if (sNo === "") {
  //   const errorText = $("#sNoResult").text("* all fields are Required!!");
  //   errorText.css("color", "red");
  // }
  // if (jobId === "") {
  //   const errorText = $("#jobIdResult").text("* all fields are Required!!");
  //   errorText.css("color", "red");
  // }
  // if (role === "") {
  //   const errorText = $("#roleResult").text("* all fields are Required!!");
  //   errorText.css("color", "red");
  // }
  // if (skills === "") {
  //   const errorText = $("#skillsResult").text("* all fields are Required!!");
  //   errorText.css("color", "red");
  // }
  // if (jobStatus === "") {
  //   const errorText = $("#statusResult").text("* all fields are Required!!");
  //   errorText.css("color", "red");
  // }

  const fields = [
    { value: sNo, resultId: "#sNoResult" },
    { value: jobId, resultId: "#jobIdResult" },
    { value: role, resultId: "#roleResult" },
    { value: skills, resultId: "#skillsResult" },
    { value: jobStatus, resultId: "#statusResult" },
  ];

  fields.forEach((field) => {
    if (!field.value) {
      const errorText = $(field.resultId).text("* all fields are Required!!");
      errorText.css("color", "red");
    } else {
      $(field.resultId).text("");
    }
  });

  if (!sNo || !jobId || !role || !skills || !jobStatus) {
    Swal.fire({
      title: "Error!",
      text: "Please fill in all fields before adding a job.",
      icon: "error",
    });
    return;
  }

  const addNew = {
    "S.No": sNo,
    "Job Id": jobId,
    Role: role,
    Skills: skills,
    Status: jobStatus,
  };

  // jsonData.table.push(addNew);
  jsonData.table.unshift(addNew);
  console.log(jsonData);

  const tableBody = document.querySelector("#jobTable tbody");
  const tableRow = document.createElement("tr");

  tableRow.innerHTML = `
      <th scope="row">${addNew["S.No"]}</th>
      <td>${addNew["Job Id"]}</td>
      <td>${addNew.Role}</td>
      <td>${addNew.Skills}</td>
      <td><button class="btn btn-success" onclick="applyJob(this)">Apply</button></td>
  `;

  tableBody.appendChild(tableRow);

  Swal.fire({
    title: "Success!",
    text: "Job added successfully!",
    icon: "success",
  });

  document.getElementById("sNo").value = "";
  document.getElementById("jobId").value = "";
  document.getElementById("jobRole").value = "";
  document.getElementById("skills").value = "";
  document.getElementById("status").value = "";
});

populateTable();

// validation

$(document).ready(function () {
  $("#button-contact").click(function () {
    Swal.fire({
      title: "Received",
      text: "We will Contact you shortly",
      icon: "success",
    });
  });
});

$(document).ready(function () {
  $("#sNo").on("input", function () {
    var sNoInp = $("#sNo").val();
    var sNo_regex = /^\d{1,}$/;
    if (sNo_regex.test(sNoInp)) {
      $("#sNo").css("border", "green solid 1px");
      $("#sNoResult").text("");
    } else {
      $("#sNo").css("border", "red solid 1px");
      const errorSno = $("#sNoResult").text(
        "Only Numbers[1-9] accepted & length is 3"
      );
      errorSno.css("color", "red");
    }
  });
  $("#jobId").on("input", function () {
    var jobIdInp = $("#jobId").val();
    var jobId_regex = /^\d{4}$/;
    if (jobId_regex.test(jobIdInp)) {
      $("#jobId").css("border", "green solid 1px");
      $("#jobIdResult").text("");
    } else {
      $("#jobId").css("border", "red solid 1px");
      const errorJid = $("#jobIdResult").text(
        "Only Numbers[1-9],Maximum length 4"
      );
      errorJid.css("color", "red");
    }
  });
  $("#jobRole").on("input", function () {
    var roleInp = $("#jobRole").val();
    var role_regex = /^[a-zA-Z]+$/;
    if (role_regex.test(roleInp)) {
      $("#sNo").css("border", "green solid 1px");
      $("#roleResult").text("");
    } else {
      $("#jobRole").css("border", "red solid 1px");
      const errorRole = $("#roleResult").text("Use Characters Only");
      errorRole.css("color", "red");
    }
  });
  $("#skills").on("input", function () {
    var skillsInp = $("#skills").val();
    var skills_regex = /^[a-zA-Z]+$/;
    if (skills_regex.test(skillsInp)) {
      $("#skills").css("border", "green solid 1px");
      $("#skillsResult").text("");
    } else {
      $("#skills").css("border", "red solid 1px");
      const errorSkills = $("#skillsResult").text(
        "only characters[a-z,A-Z] Write Multiple Skills"
      );
      errorSkills.css("color", "red");
    }
  });
  $("#status").on("input", function () {
    var statusInp = $("#status").val();
    var status_regex = /^[a-zA-Z]+$/;
    if (status_regex.test(statusInp)) {
      $("#status").css("border", "green solid 1px");
      $("#statusResult").text("");
    } else {
      $("#status").css("border", "red solid 1px");
      const errorStatus = $("#statusResult").text("Specify Status");
      errorStatus.css("color", "red");
    }
  });
});
