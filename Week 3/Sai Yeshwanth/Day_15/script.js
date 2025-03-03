function getData() {
  return {
    firstName: document.getElementById("fName").value,
    lastName: document.getElementById("lName").value,
  };
}

function displayData(data) {
  document.getElementById("content").innerText = JSON.stringify(data);
  document.getElementById("content").classList.add("text-muted");
}

function displayError(error) {
  document.getElementById("content").innerText = `${error}`;
  document.getElementById("content").classList.add("text-danger");
}

function dataValidation(data) {
  if (!(data.firstName && data.lastName)) {
    throw new Error("Fill all the fields");
  }
}

document.getElementById("btn1").addEventListener("click", async function () {
  try {
    let data = getData();
    dataValidation(data);
    let url = "https://dummyjson.com/users/add";
    let http = new XMLHttpRequest();
    let params = JSON.stringify(data);
    http.open("POST", url, true);

    http.setRequestHeader("Content-Type", "application/json");
    http.onload = function () {
      displayData(JSON.parse(http.responseText));
    };
    http.send(params);
  } catch (error) {
    displayError(error);
  }
});

document.getElementById("btn2").addEventListener("click", async function () {
  try {
    let data = getData();
    dataValidation(data);
    let response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let result = await response.json();
    displayData(result);
  } catch (error) {
    displayError(error);
  }
});

$("#btn3").click(async function () {
  try {
    const data = getData();
    dataValidation(data);
    const response = await $.post({
      url: "https://dummyjson.com/users/add",
      // method: "POST",
      contentType: "application/json",
      body: JSON.stringify(data),
    });
    displayData(response);
  } catch (error) {
    displayError(error);
  }
});
