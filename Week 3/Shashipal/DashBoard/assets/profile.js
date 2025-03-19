$("#sidebar").load("sidebar.html")
if(!localStorage.getItem("token")){
    window.location.href="index.html"
}
$(document).ready(function () {
    $.ajax({
        url: 'https://dummyjson.com/auth/me',
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
        success: function (res) {
            console.log(res)
            $("#profile").empty()
            let user = res
            $("#profile").html(` <div class="card mb-3 border-0 bg-body-tertiary" >
        <div class="row g-0 ">
          <div class="col-md-3 text-center ">
            <img src=${user.image} class="img-fluid rounded-circle border border-success border-4" alt="...">
            <h3 class="text-center">@${user.username}</h3>
    
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title">${user.firstName} ${user.maidenName} ${user.lastName}</h5>
              <p class="card-text">${user.company.title}, ${user.company.department}, ${user.company.name}</p>
              <p class="card-text"><small class="text-body-secondary">${user.address.address},${user.address.city},${user.address.state},${user.address.country}</small></p>
            </div>
          </div>
        </div>
      </div>`)


            $.ajax({
                url: 'https://dummyjson.com/posts/user/'+user.id,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    console.log(res)
                    $("#posts").empty()
                    let posts = res.posts
                    for (post of posts) {
                        $("#posts").append(` <div class="col">
                <div class="card h-100 border-0 shadow">
                <div class="d-flex gap-2 mx-3 mt-3">
                <img src=${user.image} class="img-fluid rounded-circle border border-success border-2 " style="width:35px"/>
                <h3>${user.username}</h3>
                </div>
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.body}</p>
                    </div>
                    <div class="bg-body-secondary d-flex justify-content-around py-3">
                   <div>
                   <i class="fa-solid fa-heart"></i>
                   <span>${post.reactions.likes}</span>
                   </div>
                   <div>
                   <i class="fa-solid fa-eye"></i>
                   <span>${post.views}</span>
                   </div>
                   <div>
                   <i class="fa-solid fa-thumbs-down"></i>
                   <span>${post.reactions.dislikes}</span>
                   </div>

                    </div>
                </div>
            </div>`)
                    }
                }

            })
        },
        error: function () {
            console.log(error)
        }
    })
})