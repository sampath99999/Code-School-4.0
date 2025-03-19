$("#sidebar").load("sidebar.html")
let role = localStorage.getItem("role")
if (!role) {
  window.location.href = "userLogin.html"
}
if (role == "admin") {
  $("#add-btn").css("display", "block")
}
else {
  $("#add-btn").css("display", "none")
}
let moviesList = JSON.parse(localStorage.getItem("moviesList")) || [];
localStorage.setItem("moviesList", JSON.stringify(moviesList));
console.log(JSON.parse(localStorage.getItem("moviesList")));
$(document).ready(function () {
  moviesList.map((movie, index) => {
    console.log(movie)
    let modifyButtons = role === "admin" ? ` <div class=" m-2  position-absolute">
        <button class="btn btn-secondary  edit-btn" data-id=${index}><i class="fa-solid fa-pen "></i></button>
          <button class="btn btn-danger delete-btn " ><i class="fa-solid fa-trash "></i></button>
      </div>`: ""

    $("#movies > .row").append(`
            <div class="col">
                  <div class="card h-100 border-0 shadow ">
                    <img src=${movie.image} class="card-img-top rounded" alt="...">
                    <div class="card-body p-2">
                      <h5 class="card-title mb-0">${movie.movieName}</h5>
                      <p class="card-text text-secondary">${movie.genre}</p>
                    </div>
                   ${modifyButtons}
                    <div class="text-center mb-2">
                    <button class="btn btn-outline-danger w-75 book-ticket" data-id=${index}>Book Ticket</button>
                    </div>
                  </div>
                </div>`)
  })

  $(".delete-btn").click(function (e) {
    e.preventDefault()
    let title = $(this).closest(".card").find(".card-title").text()
    moviesList = moviesList.filter(movie => movie.movieName !== title)
    localStorage.setItem("moviesList", JSON.stringify(moviesList))
    $(this).closest(".col").remove()
  })
  $(".edit-btn").click(function (e) {
    e.preventDefault()
    let id = $(this).data("id")
    window.location.href = `addmovie.html?id=${id}`

  })
  $(".book-ticket").click(function (e) {
    e.preventDefault()
    let id = $(this).data("id")
    window.location.href = `bookTicket.html?id=${id}`
  })
})