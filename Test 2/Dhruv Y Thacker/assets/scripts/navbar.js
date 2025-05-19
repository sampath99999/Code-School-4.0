$(document).ready(function() {
    let token = sessionStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    $.ajax({
        url: "api/getNavItems.php",
        type: "GET",
        headers: {
            'Authorization': token
        },
        success: function(res) {
            if (res.status && res.data) {
                const currentPage = window.location.pathname.split('/').pop();
                
                res.data.forEach(item => {
                    const isActive = currentPage === item.url;
                    $("#navbarContent ul").append(`
                        <li class="nav-item me-4">
                            <a class="nav-link fw-medium text-dark ${isActive ? 'active' : ''}" 
                               href="${item.url}">
                                ${item.name}
                            </a>
                        </li>
                    `);
                });
                $("#navbarContent ul").append(`
                    <li class="nav-item d-block d-lg-none">
                        <button class="btn btn-danger w-100 logout">Logout</button>
                    </li>
                `);
            }
        },
        error: function(err) {
            console.log(err);
            Swal.fire("Error", "Failed to load navigation", "error");
        }
    });

    // Handle logout
    $(document).on("click", ".logout", function(e) {
        e.preventDefault();
        
        $.ajax({
            url: "api/logout.php",
            type: "POST",
            headers: {
                "Authorization": token
            },
            success: function(res) {
                sessionStorage.clear();
                Swal.fire("Success", res.message, "success").then(() => {
                    window.location.href = "index.html";
                });
            },
            error: function(err) {
                Swal.fire("Error", "Logout failed", "error");
            }
        });
    });
}); 