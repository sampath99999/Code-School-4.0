$("#sidebar").load("sidebar.html");
let role = localStorage.getItem("role")
if (!role) {
    window.location.href = "userLogin.html"
}
let bookedTickets = JSON.parse(localStorage.getItem("bookedTickets")) || [];
console.log(bookedTickets)
let moviesList = JSON.parse(localStorage.getItem("moviesList"))
console.log(moviesList)
localStorage.setItem("bookedTickets", JSON.stringify(bookedTickets));
$(document).ready(function () {
    for (ticket of bookedTickets) {
        console.log(ticket)
        let movie = moviesList.find(item => item.movieName == ticket.MovieName)
        console.log(movie)
        $("#booked-tickets").append(`
            <div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
          <img src=${movie.image} class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
          </div>
        </div>
      </div>
    </div>
            `)
    }
})