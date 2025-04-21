let token = sessionStorage.getItem("token")
if (!token) {
    window.location.href = "index.html"
}
$(document).ready(function () {
    $("#navbar").load("navbar.html")
    $.ajax({
        url: "api/getProfile.php",
        type: "GET",
        headers: {
            "Authorization": sessionStorage.getItem("token")
        },
        success: function (res) {
            console.log(res)
            let data = res.data
            $("#profile").append(`
                <table class="m-3 w-100">
                <tr>
                    <th>Employee Id</th>
                    <td>:   ${data.id}</td>
                </tr>
                <tr>
                    <th>Employee Id</th>
                    <td>:   ${data.id}</td>
                </tr>
                <tr>
                    <th>Employee Name</th>
                    <td>:   ${data.name}</td>
                </tr>
                <tr>
                    <th>Phone Number </th>
                    <td>:   ${data.phone_number}</td>
                </tr>
                <tr>
                    <th>Date Of Birth</th>
                    <td>:   ${data.date_of_birth}</td>
                </tr>
                 <tr>
                    <th>Address</th>
                    <td>:   ${data.address}</td>
                </tr>
                </table>
                `)
        },
        error: function (err) {
            console.log(err)
        }
    })
})