//using Fetch
let first_name = document.getElementById('first_name');
let last_name = document.getElementById('last_name');
let age = document.getElementById('age');
let fetch_Btn = document.getElementById('fetch_Btn');
let displayContainer = document.getElementById('displayContainer');  // Correct ID

fetch_Btn.addEventListener("click", function (e) {
    e.preventDefault();

    fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: first_name.value,
            lastName: last_name.value,
            age: age.value
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Response:", data);
            // alert("User added successfully! (fetch)");
            Swal.fire({
                title: "Success!",
                text: "User added successfully! (fetch)",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "gray", 
            });
            displayContainer.innerHTML = `
            <div class="alert alert-secondary">
                <h5>User Added Successfully by Clicking Fetch Button!</h5>
                <p><strong>First Name:</strong> ${data.firstName}</p>
                <p><strong>Last Name:</strong> ${data.lastName}</p>
                <p><strong>Age:</strong> ${data.age}</p>
            </div>
        `;
        })

});

//JQUERY
$(document).ready(function () {
    $("#jquery_Btn").click(function (event) {
        event.preventDefault(); // Prevent default form submission

        $.post({
            url: "https://dummyjson.com/users/add",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                firstName: $("#first_name").val(),
                lastName: $("#last_name").val(),
                age: $("#age").val(),
            }),
            success: function (response) {
                console.log(response);
                // alert("User added successfully!(JQuery)");
                Swal.fire({
                    title: "Success!",
                    text: "User added successfully!(JQuery)",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "gray", 
                });
                $("#displayContainer").html(`
                   
                        <h5>User Added Successfully! by Clicking JQuery Button</h5>
                        <p><strong>First Name:</strong> ${response.firstName}</p>
                        <p><strong>Last Name:</strong> ${response.lastName}</p>
                        <p><strong>Age:</strong> ${response.age}</p>
                   
                `);
            },
            error: function (error) {
                console.error(error);
                alert("Failed to add user.");
            }
        });
    });
});



//Ajax with XMLHttpRequest
ajax_Btn.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent form submission

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://dummyjson.com/users/add", true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    let data = JSON.stringify({
        firstName: first_name.value,
        lastName: last_name.value,
        age: age.value
    });

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) { // Request completed
            if (xhttp.status >= 200 && xhttp.status < 300) {
                let response = JSON.parse(xhttp.responseText);
                console.log(response);
                // alert("User added successfully!(Ajax with xmlHttp)");
                Swal.fire({
                    title: "Success!",
                    text: "User added successfully!(Ajax with xmlHttp)",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "gray", // Orange color
                });
                document.getElementById("displayContainer").innerHTML = `
                <div class="alert alert-secondary">
                    <h5>User Added Successfully! By Clicking Ajax Button</h5>
                    <p><strong>First Name:</strong> ${response.firstName}</p>
                    <p><strong>Last Name:</strong> ${response.lastName}</p>
                    <p><strong>Age:</strong> ${response.age}</p>
                </div>
            `;
            } else {
                console.error(xhttp.status, xhttp.statusText);
                alert("Failed to add user.");
            }
        }
    };

    xhttp.send(data);
});