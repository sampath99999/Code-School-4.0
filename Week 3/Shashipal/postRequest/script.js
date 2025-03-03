document.getElementById("with-fetch").addEventListener("click", function postWithFetch(e) {
    e.preventDefault()
    let firstName = document.getElementById("first-name").value
    let lastName = document.getElementById("last-name").value
    let age = document.getElementById("age").value
    if (!firstName.trim() || !lastName.trim() || !age.trim()) {
        Swal.fire({
            title: "Warning",
            text: "Enter all Fields",
            icon: "warning"
        });
        return
    }
    fetch("https://dummyjson.com/users/ad",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName,
                lastName,
                age
            })
        }
    ).then(res => res.json())
        .then(data => {
            console.log(data)
            document.querySelector("#with-fetch+span").textContent = "SUCCESS!"
            let tbody = document.querySelector("tbody")
            let tr = document.createElement("tr")
            tr.innerHTML = ` <th>Fetch</th>
            <td>${data.firstName}</td>
            <td>${data.lastName}</td>
            <td>${data.age}</td>`
            tbody.appendChild(tr)
        })
        .catch(err => {
            console.log(err.message)
            document.querySelector("#with-fetch+span").textContent = "FAILED!"
        })
})

document.getElementById("with-xml").addEventListener("click", (e) => {
    e.preventDefault()
    let firstName = document.getElementById("first-name").value
    let lastName = document.getElementById("last-name").value
    let age = document.getElementById("age").value
    if (!firstName.trim() || !lastName.trim() || !age.trim()) {
        Swal.fire({
            title: "Warning",
            text: "Enter all Fields",
            icon: "warning"
        });
        return
    }
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "https://dummyjson.com/users/add", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        firstName,
        lastName,
        age
    }))
    xhttp.onload = function () {
        let data = JSON.parse(xhttp.responseText)
        console.log(data)
        document.querySelector("#with-xml+span").textContent = "SUCCESS!"
        let tbody = document.querySelector("tbody")
        let tr = document.createElement("tr")
        tr.innerHTML = ` <th>XMLHTTPRequest</th>
            <td>${data.firstName}</td>
            <td>${data.lastName}</td>
            <td>${data.age}</td>`
        tbody.appendChild(tr)
    }
    xhttp.onerror = function () {
        console.log("error")
        document.querySelector("#with-xml+span").textContent = "FAILED!"


    }




})

$(document).ready(function () {
    $("#with-jquery").on("click", function (e) {
        e.preventDefault()
        let firstName = $("#first-name").val()
        let lastName = $("#last-name").val()
        let age = $("#age").val()
        if (!firstName.trim() || !lastName.trim() || !age.trim()) {
            Swal.fire({
                title: "Warning",
                text: "Enter all Fields",
                icon: "warning"
            });
            return
        }

        $.post("https://dummyjson.com/users/ad",
            {
                firstName,
                lastName,
                age
            },
            function (data, status) {
                console.log(data)
                $("#with-jquery+span").text("SUCCESS!")
                $("tbody").append($("<tr></tr>").html(` <th>JQuery</th>
                    <td>${data.firstName}</td>
                    <td>${data.lastName}</td>
                    <td>${data.age}</td>`))

            })


            .fail(function () {
                console.log("error")
                $("#with-jquery+span").text("FAILED!")

            })

    })
})