// Fetch API POST
document.getElementById('fetchBtn').addEventListener('click', function () {
    fetch("https://dummyjson.com/users/add", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: document.getElementById('fName').value,
            lastName: document.getElementById('lName').value,
            age: document.getElementById('age').value
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("fetch API data", data)
            document.getElementById('fetchResult').textContent = `Success: First Name- ${data.firstName}, Last name- ${data.lastName} and Age- ${data.age} added!`;
            document.getElementById('fetchResult').classList.add('alert-success');
        })
        .catch(error => {
            document.getElementById('fetchResult').textContent = "Error: Unable to post data";
            document.getElementById('fetchResult').classList.add('alert-danger');
        });
});

// jQuery POST
$(document).ready(function () {
    $('#jqueryBtn').click(function () {
        $.post({
            url: "https://dummyjson.com/users/add",
            contentType: "application/json",
            data: JSON.stringify({
                firstName: $('#fName').val(),
                lastName: $('#lName').val(),
                age: $('#age').val()
            }),
            success: function (response) {
                console.log("jquery data", response)
                $('#jqueryResult').text(`Success: First Name- ${response.firstName}, Last name- ${response.lastName} and Age- ${response.age} added!`).addClass('alert-success');;
            },
            error: function () {
                $('#jqueryResult').text("Error: Unable to post data").addClass('alert-danger');
            },
        });
    });
})

// XHR POST
document.getElementById('xhrBtn').addEventListener('click', function () {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://dummyjson.com/users/add", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function () {
        let response = JSON.parse(this.responseText);
        console.log("xhr data", response)
        document.getElementById('xhrResult').textContent = `Success: First Name- ${response.firstName}, Last name- ${response.lastName} and Age- ${response.age} added!`;
        document.getElementById('xhrResult').classList.add('alert-success');
    };
    xhr.onerror = function () {
        document.getElementById('xhrResult').textContent = "Error: Unable to post data";
        document.getElementById('xhrResult').classList.add('alert-danger');
    };
    xhr.send(JSON.stringify({
        firstName: document.getElementById('fName').value,
        lastName: document.getElementById('lName').value,
        age: document.getElementById('age').value
    }));
});