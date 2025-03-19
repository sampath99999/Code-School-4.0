$("#sidebar").load("sidebar.html");
let role = localStorage.getItem("role")
if (!role) {
    window.location.href = "userLogin.html"
}
if (role !== "admin") {
    window.location.href = "movies.html"
}
let theaters = JSON.parse(localStorage.getItem("theaters")) || [];
localStorage.setItem("theaters", JSON.stringify(theaters));
console.log(JSON.parse(localStorage.getItem("theaters")));
let searchParam = new URLSearchParams(window.location.search)
let id = searchParam.get("id")
let totalSeats = 0
let theaterData = {};
let formFields = [
    {
        id: "theater-name",
        type: "text",
        label: "Theater name",
        rules: ["required"],
        key: "theaterName"
    },
    {
        id: "theater-description",
        type: "text",
        label: "Description",
        rules: ["required"],
        key: "description"
    },
    {
        id: "shows",
        class: "show-option",
        type: "dropdown",
        label: "At least one show",
        rules: ["required"],
        key: "shows"
    },
    {
        id: "seat-class",
        class: "class-option",
        type: "dropdown",
        label: "At least one class",
        rules: ["required"],
        key: "seatClass"
    },
    {
        id: "seats",
        type: "number",
        label: "Seats",
        rules: ["required", "min:25", "max:150"],
        key: "totalSeats"
    },
    {
        id: "address",
        type: "text",
        label: "Address",
        rules: ["required", "min:10"],
        key: "address"
    }
];

function validateFormField(field) {
    let value;
    let errorElement = $(`#${field.id} ~ p`);
    if (field.type == "dropdown") {
        value = [];
        $(`.${field.class}:checked`).each(function () {
            value.push($(this).val())
        })
    } else {
        value = $(`#${field.id}`).val();
    }
    theaterData[field.key] = value;
    for (let rule of field.rules) {
        if (rule == "required") {
            if (!value || value.length == 0) {
                errorElement.text(`${field.label} is required`);
                $(`#${field.id}`).addClass("is-invalid")
                return false;
            }
        }

        if (rule.includes("min")) {
            let splittedRule = rule.split(":");
            let minLength = parseInt(splittedRule[1]);
            if (field.type == "number") {
                if (value < minLength) {
                    $(`#${field.id}`).addClass("is-invalid")
                    errorElement.text(`${field.label} should be at least ${minLength}`);
                    return false;
                }
            }
            else {
                if (value.length < minLength) {
                    $(`#${field.id}`).addClass("is-invalid")
                    errorElement.text(`${field.label} should be at least ${minLength} characters`);
                    return false;
                }
            }


            if (rule.includes("max")) {
                let splittedRule = rule.split(":");
                let maxLength = parseInt(splittedRule[1]);
                if (field.type == "number") {
                    if (value > maxLength) {
                        $(`#${field.id}`).addClass("is-invalid")
                        errorElement.text(`${field.label} should not exceed ${maxLength}`);

                        return false;
                    }
                }
                else {
                    if (value.length > maxLength) {
                        $(`#${field.id}`).addClass("is-invalid")
                        errorElement.text(`${field.label} should not exceed ${maxLength} characters`);
                        return false;
                    }
                }
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
    if (id) {
        let theater = theaters[id]
        console.log(theater)
        $("#theater-name").val(theater.theaterName);
        $("#theater-description").val(theater.description);
        $("#seats").val(theater.totalSeats)
        $("#address").val(theater.address)
        $("#add").text("EDIT")
        let shows = theater.shows
        $(".show-option").each(function () {
            if (shows.includes($(this).val())) {
                $(this).prop("checked", true)
            }
        })
        let seatClass = theater.seatClass
        $(".class-option").each(function () {
            if (seatClass.includes($(this).val())) {
                $(this).prop("checked", true)
            }
        })
    }


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

    function changeChecked() {
        totalSeats = 0
        if (!$(".class-option:checked").length) {
            $("#select-all-classes").prop("checked", false);
        } else if ($(".class-option:checked").length === $(".class-option").length) {
            $("#select-all-classes").prop("checked", true);
        } else {
            $("#select-all-classes").prop("checked", false);
        }
        $(".class-option:checked").each(function () {
            seats = $(this).val().split(" ")[1].slice(1,)
            totalSeats += Number(seats)

        })
        $("#seats").val(totalSeats)
    }

    $(document).on("change", ".class-option",changeChecked);
    $("#select-all-classes").change(function () {
        $(".class-option").prop("checked", $(this).is(":checked"));
       changeChecked()
    });

    $("#add").on("click", function (e) {
        e.preventDefault();
        if (validateForm()) {

            if (id) {
                theaters[id] = theaterData
            }
            else {
                theaters.push(theaterData);
            }

            localStorage.setItem("theaters", JSON.stringify(theaters));
            console.log(theaters);
            Swal.fire({
                title: 'Success!',
                text: 'Movie added successfully!',
                icon: 'success'
            }).then(() => {
                if (id) {
                    window.location.href = "theaterList.html"
                }
                else {
                    location.reload()
                }
            })
        }
    });
});
