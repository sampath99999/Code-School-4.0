$("#sidebar").load("sidebar.html");
let role = localStorage.getItem("role")
if (!role) {
    window.location.href = "userLogin.html"
}
if (role !== "admin") {
    window.location.href = "movies.html"
}
let moviesList = JSON.parse(localStorage.getItem("moviesList")) || [];
localStorage.setItem("moviesList", JSON.stringify(moviesList));
console.log(JSON.parse(localStorage.getItem("moviesList")));
let theaterCount = 0;
let availableTheaters = JSON.parse(localStorage.getItem("theaters"));
let addedTheaters = [];
let movieTheaters = {}
console.log(availableTheaters);
let searchParam = new URLSearchParams(window.location.search)
let id = searchParam.get("id")
console.log(id)
$(document).ready(function () {
    $("#movie-image-url").parent().css("display", "none")

    if (id) {
        let movie = moviesList[id]
        console.log(movie)
        movieTheaters = movie.theaters
        console.log(movieTheaters)
        addedTheaters = Object.keys(movieTheaters)
        $("#movie-image-url").parent().css("display", "block")
        $("#movie-name").val(movie.movieName);
        $("#movie-description").val(movie.description);
        $("#run-time").val(movie.time);
        $("#genre").val(movie.genre);
        $("#movie-image-url").val(movie.image);
        $("#add-movie").text("EDIT")
        $("#movie-image").change(function () {
            let reader = new FileReader();
            let file = $("#movie-image")[0].files[0];
            if (file) {
                reader.readAsDataURL(file)
            }
            reader.onloadend = function () {
                $("#movie-image-url").val(reader.result);
            }

        })
        for (theater of addedTheaters) {
            console.log(theater)
            $("#added-theaters").append(`
                <div class="row mb-3 border p-2 align-items-center">
                    <p class="col-sm-6 col-12 mb-0">${theater} 
                    shows-${movie.theaters[theater].join(", ")}</p>
                    <div class="col-sm-6 col-12 text-sm-end d-inline">
                        <button class="btn btn-danger mx-1 delete-btn" data-val=${theater.split(" ").join("-")}>Delete</button>
                    </div>
                </div>
            `);
        }

    }
    $("#show-theater-fields").click(function (e) {
        e.preventDefault();
        theaterCount++;

        let theaterOptions = availableTheaters.map(theater => {
            return `<option value="${theater.theaterName}">${theater.theaterName}</option>`;
        })

        let theaterField = `
            <div class="mb-3">
                <select class="form-select theater-select">
                    <option selected disabled>Select Theater</option>
                    ${theaterOptions}
                </select>
            </div>
            <div class="mb-3">
                <div class="dropdown" id="shows">
                </div>
            </div>
            <div class="mb-3">
                <button type="button" class="btn btn-primary" id="add-theater">Add</button>
            </div>
        `;

        $("#theater-fields").html(theaterField);
    });

    $(document).on("change", ".theater-select", function () {
        let selectedTheater = $(this).val();
        let theater = availableTheaters.find(theater => theater.theaterName === selectedTheater);
        let showOptions = theater ? theater.shows.map(show => {
            return `<li class="px-2 pb-2"><input type="checkbox" class="form-check-input show-option"
            id="${show}" value="${show}"/> <label class="form-check-label" for="${show}">${show}</label>
            </li>`;
        }).join("") : " ";

        $("#shows").html(`
            <button class="btn btn-white  dropdown-toggle w-100 text-start" type="button"
                                id="shows-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Select Show
                            </button>
                            <ul class="dropdown-menu w-100" aria-labelledby="shows-dropdown">
                              <li class="px-2 pb-2"><input type="checkbox" class="form-check-input" id="select-all">
                                    <label class="form-check-label" for="select-all">Select all</label>
                                </li>
                               ${showOptions}
                            </ul>
                        </div>
                        <p class="text-danger mx-3 my-2"></p>
            </div>
        `);
        $("#select-all").change(function () {
            $(".show-option").prop("checked", $(this).is(":checked"));
        });

        $(document).on("change", ".show-option", function () {
            if (!$(".show-option:checked").length) {
                $("#select-all").prop("checked", false);
            } else if ($(".show-option:checked").length === $(".show-option").length) {
                $("#select-all").prop("checked", true);
            } else {
                $("#select-all").prop("checked", false);
            }
        });
    });


    $(document).on("click", "#add-theater", function (e) {
        e.preventDefault();
        console.log("clicked")
        let selectedTheater = $(".theater-select").val();
        let selectedShows = $(".show-option:checked").map((index, item) => {
            console.log(item.value)
            return item.value
        }).get()
        if (!selectedTheater || !selectedShows.length) {
            return;
        }
        if (!addedTheaters.includes(selectedTheater)) {
            addedTheaters.push(selectedTheater);
            movieTheaters[selectedTheater] = selectedShows;
            availableTheaters = availableTheaters.filter(theater => theater.theaterName !== selectedTheater);
            $("#added-theaters").append(`
                <div class="row mb-3 border p-2 align-items-center">
                    <p class="col-sm-6 col-12 mb-0">${selectedTheater} 
                    shows-${selectedShows.join(", ")}</p>
                    <div class="col-sm-6 col-12 text-sm-end d-inline">
                        <button class="btn btn-danger mx-1 delete-btn" data-val=${selectedTheater.split(" ").join("-")} >Delete</button>
                    </div>
                </div>
            `);
            $("#theater-fields").empty();
        }
    });
    $(".delete-btn").click(function (e) {
        e.preventDefault();
        let theater = $(this).data("val").split("-").join(" ")
        console.log(theater);
        let removedTheater = JSON.parse(localStorage.getItem("theaters")).find(item => item.theaterName === theater)
        console.log(removedTheater)
        addedTheaters = addedTheaters.filter(item => item !== theater)
        availableTheaters.push(removedTheater)
        $(this).closest(" .row").remove()
    })
    $("#add-movie").click(function (e) {
        e.preventDefault()
        let movieName = $("#movie-name").val()
        let description = $("#movie-description").val()
        let time = $("#run-time").val()
        let genre = $("#genre").val()
        let image = id ? $("#movie-image-url").val() : ($("#movie-image").val());
        function validateForm() {
            $("#movie-name + p").text("")
            $("#movie-description + p").text("")
            $("#run-time + p").text("")
            $("#genre + p").text("")
            $("#added-theaters").find("p").text("")
            let status = true
            if (!movieName.trim()) {
                $(`#movie-name`).addClass("is-invalid")
                $("#movie-name + p").text("Movie Name is required")
                status = false
            }
            else {
                $(`#movie-name`).removeClass("is-invalid")
                $(`#movie-name`).addClass("is-valid")
                $("#movie-name + p").text("")
            }
            if (!description.trim()) {
                $(`#movie-description`).addClass("is-invalid")
                $("#movie-description + p").text("Movie Description is required")
                status = false
            }
            else {
                $(`#movie-description`).removeClass("is-invalid")
                $(`#movie-description`).addClass("is-valid")
                $("#movie-description + p").text("")
            }
            if (!time) {
                $(`#run-time`).addClass("is-invalid")
                $("#run-time + p").text("Run time is required")
                status = false
            }
            else if (Number(time.split(":").join("")) > 400) {
                $(`#run-time`).addClass("is-invalid")
                $("#run-time + p").text("Run time  cannot exceed 4 hours")
                status = false
            }
            else {
                $(`#run-time`).removeClass("is-invalid")
                $(`#run-time`).addClass("is-valid")
                $("#run-time + p").text("")
            }
            if (!genre.trim()) {
                $(`#genre`).addClass("is-invalid")
                $("#genre + p").text("Genre is required ")
                status = false
            }
            else {
                $(`#genre`).removeClass("is-invalid")
                $(`#genre`).addClass("is-valid")
                $("#genre + p").text("")
            }
            if (!image) {
                $(`#movie-image`).addClass("is-invalid")
                $("#movie-image + p").text("Image is required")
                status = false
            }
            else {
                $(`#movie-image`).removeClass("is-invalid")
                $(`#movie-image`).addClass("is-valid")
                $("#movie-image + p").text("")
            }
            if (addedTheaters.length === 0) {
                $("#added-theaters").find("p").text("Add theaters")
                status = false
            }
            if (Object.keys(movieTheaters).length === 0) {
                $("#added-theaters").find("p").text("Add theaters")
                status = false
            }
            return status
        }

        if (id) {
            if (validateForm()) {
                let newMovie = {
                    movieName,
                    description,
                    time,
                    genre,
                    image: $("#movie-image-url").val(),
                    theaters: movieTheaters
                }


                moviesList[id] = newMovie
                localStorage.setItem("moviesList", JSON.stringify(moviesList))
                Swal.fire({
                    title: 'Success!',
                    text: 'Movie added successfully!',
                    icon: 'success'
                }).then(() => {
                    window.location.href = "movies.html"
                })
            }
        }
        else {
            if (validateForm()) {
                let reader = new FileReader();
                let file = $("#movie-image")[0].files[0];
                if (file) {
                    reader.readAsDataURL(file)
                }
                reader.onloadend = function () {
                    let newMovie = {
                        movieName,
                        description,
                        time,
                        genre,
                        image: reader.result,
                        theaters: movieTheaters
                    }
                    moviesList.push(newMovie)
                    localStorage.setItem("moviesList", JSON.stringify(moviesList))
                    Swal.fire({
                        title: 'Success!',
                        text: 'Movie added successfully!',
                        icon: 'success'
                    }).then(() => {
                        location.reload()
                    })

                }
            }
        }

    })

});
