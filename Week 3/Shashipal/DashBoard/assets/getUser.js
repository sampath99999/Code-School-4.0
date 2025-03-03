$("#sidebar").load("sidebar.html")
if(!localStorage.getItem("token")){
    window.location.href="index.html"

}
$(document).ready(function () {
    $.ajax({
        url: 'https://dummyjson.com/users',
        type: "GET",
        datatype: "json",
        success: function (res) {
            console.log(res)
            let users = res.users
            console.log(users)
            $("#cards").empty()
            for (user of users) {
                $("#cards").append(`<div class="col">
                <div class="card h-100 shadow border-0">
                    <img src="${user.image}" class="card-img-top " alt="${user.firstName} ${user.lastName}">
                    <div class="card-body">
                        <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                        <p class="card-text"><span class="fw-bold">${user.role.toUpperCase()}</span>,
                        ${user.company.name}</p>
                        <div class="d-flex flex-wrap gap-2 justify-content-between">
                        <button class="btn btn-danger delete-btn" id="" data=${user.id}> Delete </button>
                        <button class="btn btn-secondary update-btn" data-id="${user.id}" data-username="${user.username}"> Update </button>
                        </div>
                    </div>
                </div>
            </div>
`)

            } $(".delete-btn").click(function () {
                let userId = $(this).attr("data")
                console.log(userId)
                $.ajax({
                    url: 'https://dummyjson.com/users/' + userId,
                    type: "DELETE",
                    success: (res) => {
                        console.log(res)
                        $(this).closest(".col").remove()
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            })
            $(".update-btn").click(function(){
                let userId=$(this).attr("data-id")
                let username = $(this).attr("data-username")
                window.location.href="updateUser.html?userId="+userId +"&username="+username
            })
        },
        error:function(error){
            console.log(error)
        }
    })


})
