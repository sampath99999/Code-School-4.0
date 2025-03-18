function getInputValues() {
  return {
    firstName: document.getElementById("fName").value,
    lastName: document.getElementById("lName").value,
  };
}

function displayResponse(response) {
  document.getElementById("content").innerText = JSON.stringify(response);
  document.getElementById("content").classList.add("text-muted");
}

function displayError(error) {
  document.getElementById("content").innerText = `Error: ${
    error.message || error
  }`;
  document.getElementById("content").classList.add("text-danger");
}

function validateData(data) {
  if (!(data.firstName && data.lastName)) {
    throw new Error("Fill all the fields");
  }
}

// FETCH API
document.getElementById("btn2").addEventListener("click", async function () {
  try {
    const data = getInputValues();
    validateData(data);
    const response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const result = await response.json();
    displayResponse(result);
  } catch (error) {
    displayError(error);
  }
});

// JQUERY
$("#btn3").click(async function () {
  try {
    const data = getInputValues();
    validateData(data);
    const response = await $.ajax({
      url: "https://dummyjson.com/users/add",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
    });
    displayResponse(response);
  } catch (error) {
    displayError(error);
  }
});

//AJAX
document.getElementById("btn1").addEventListener("click", function () {
  try {
    var http = new XMLHttpRequest();
    var url = "https://dummyjson.com/users/add";
    var data = getInputValues();
    validateData(data);
    var params = JSON.stringify(data);
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
      if (http.readyState === 4) {
        if (http.status >= 200 && http.status < 300) {
          displayResponse(JSON.parse(http.responseText));
        } else {
          throw new Error(`HTTP Error: ${http.status} ${http.statusText}`);
        }
      }
    };
    http.onerror = function () {
      throw new Error("Request failed");
    };
    http.send(params);
  } catch (error) {
    displayError(error);
  }
});
