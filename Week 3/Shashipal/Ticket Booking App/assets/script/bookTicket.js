$("#sidebar").load("sidebar.html")
let role = localStorage.getItem("role")
if (!role) {
    window.location.href = "userLogin.html"
}
let bookedTickets = JSON.parse(localStorage.getItem("bookedTickets")) || [];
localStorage.setItem("bookedTickets", JSON.stringify(bookedTickets));
let ticketData = {}
let searchParam = new URLSearchParams(window.location.search)
let id = searchParam.get("id")
if (!id) {
    window.location.href = "movies.html"
}
let movie = JSON.parse(localStorage.getItem("moviesList"))[id]
let theaters = JSON.parse(localStorage.getItem("theaters"))
console.log(theaters)
console.log(movie)
let formFields = [
    {
        id: "movie-name",
        type: "text",
        label: "Movie name",
        rules: ["required"],
        key: "MovieName"
    },
    {
        id: "theater",
        class: "theater-select",
        type: "select",
        label: "Theater",
        rules: ["required"],
        key: "theater"
    },
    {
        id: "show",
        class: "show-select",
        type: "select",
        label: "Show",
        rules: ["required"],
        key: "shows"
    },
    {
        id: "seat-class",
        class: "class-select",
        type: "select",
        label: "Seat class",
        rules: ["required"],
        key: "seatClass"
    },
    {
        id: "booking-date",
        type: "date",
        label: "Booking Date",
        rules: ["required"],
        key: "bookingDate"
    },
    {
        id: "tickets",
        type: "number",
        label: "Tickets",
        rules: ["required", "min:1"],
        key: "tickets"
    }
];
function validateFormField(field) {
    let value = $(`#${field.id}`).val();
    if (field.type == "select"){
        value = $(`.${field.class}`).val()? $(`.${field.class}`).val().split("-").join(" ") : $(`.${field.class}`).val()
    }
        let errorElement = $(`#${field.id} + p`);
    ticketData[field.key] = value
    for (rule of field.rules) {nn 
        if (rule == "required") {

            if (!value || value.length == 0) {
                $(`#${field.id}`).addClass("is-invalid")
                errorElement.text(`${field.label} is required`);
                return false;
            }
        }
        if (rule.includes("min")) {
            let splittedRule = rule.split(":");
            let minLength = parseInt(splittedRule[1]);
            if (value < minLength) {
                $(`#${field.id}`).addClass("is-invalid")
                errorElement.text(`${field.label} should be at least ${minLength}`);
                return false;
            }
        }
    }
    $(`#${field.id}`).removeClass("is-invalid")
    $(`#${field.id}`).addClass("is-valid")
    errorElement.text("");
    return true;
}
function validateForm() {
    let status = true;
    for (let field of formFields) {
        status = validateFormField(field) && status;
    }
    return status;
}
$(document).ready(function () {
    let theaterOptions = Object.keys(movie.theaters).map(theater => `<option value=${theater.split(" ").join("-")}>${theater}</option>`)
    $('#booking-date').val(new Date().toISOString().substring(0, 10));
    // console.log(new Date().toISOString() )
    $("#movie-name").val(movie.movieName)
    $(".theater-select").append(theaterOptions)
    $(".theater-select").on("change", function () {
        let selectedTheater = $(".theater-select").val().split("-").join(" ");
        console.log(selectedTheater)
        if (selectedTheater) {
            let showOptions = movie.theaters[selectedTheater].map(show => `<option value=${show.split(" ").join("-")}>${show}</option>`)
            $(".show-select").html(showOptions)
            let theater = theaters.find(item => item.theaterName == selectedTheater)

            console.log(theater)
            if (theater) {
                let classOptions = theater.seatClass.map(seat => `<option value=${seat.split(" ").join("-")}>${(seat).split(" ")[0]}</option>`)
                $(".class-select").html(classOptions)
            }

        }
    })
    $("#book-btn").click(function (e) {
        e.preventDefault()
        if (validateForm()) {
            let theater = theaters.find(item => item.theaterName == $(".theater-select").val().split("-").join(" "))
            if (Number(theater.totalSeats) < $("#tickets").val()) {
                $("#tickets ~ p").text(`${$("#tickets").val()} tickets are not available`)
            }
            else {
                console.log(movie)
                console.log(ticketData.shows.split(" "))
                $("#movie-image").attr("src", movie.image)
                $("#movie-details").html(`
                    <h2 class="mb-1">${movie.movieName}</h2>
                    <p class="mb-1">${movie.genre}</p>
                    <p class="mb-1">${movie.time}</p>
                    <p class="mb-1">${ticketData.bookingDate} | ${ticketData.shows.split(" ")[2].slice(1,) } -  ${ticketData.shows.split(" ")[5].slice(0,-1) }</p>

                    `)
                    console.log(ticketData.shows.split(" "))
                $("#ticket-details").html(`
                    <p class="mb-1">${ticketData.tickets} Ticket(s)</p>
                    <p class="mb-1">${ticketData.seatClass.split(" ")[0]}</p>
                    <h4 class="mb-1">${ticketData.theater}</h4>
                    `)
                $("#go-home").click(function(){
                    window.location.href = "movies.html"
                })
                bookedTickets.push(ticketData)
                localStorage.setItem("bookedTickets", JSON.stringify(bookedTickets))
                Swal.fire({
                    title: 'Success!',
                    text: 'Ticket Booked successfully!',
                    icon: 'success'
                }).then(() => {
                    $("#modal").click()
                })
            }
        }
    })
})