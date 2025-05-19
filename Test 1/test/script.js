    $(document).ready(function () {
        function fetchRecipes(query = "") {
            let apiUrl = query
                ? `https://dummyjson.com/recipes/search?q=${query}` 
                : "https://dummyjson.com/recipes"; 

            $.get(apiUrl, function (data) {
                let recipes = data.recipes || data; 
                let container = $(".container");
                container.empty(); 

                if (!recipes || recipes.length === 0) {
                    container.html("<h3 class='text-center text-danger mt-4 '>No results found</h3>");
                    return;
                }

                let row;
                recipes.forEach((recipe, index) => {
                    if (index % 4 === 0) {
                        row = $('<div class="row mb-4"></div>');
                        container.append(row);
                    }

                    let ingredients = recipe.ingredients && recipe.ingredients.length > 0
                        ? recipe.ingredients.slice(0, 4).join(", ") 
                        : "Not Available";

                    let card = `
                        <div class="col-md-3 mt-4">
                            <div class="card position-relative border border-4 border-light rounded-0 shadow recipe-card"
                                data-bs-toggle="modal" data-bs-target="#recipeModal"
                                data-name="${recipe.name}" 
                                data-image="${recipe.image}" 
                                data-ingredients='${ingredients}'>
                                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
                                <div class="position-absolute bottom-0 start-0 text-white bg-dark bg-opacity-50 fs-5 fw-bold px-1 py-1 w-100 ">
                                    ${recipe.name}
                                </div>
                            </div>
                        </div>`;
                    
                    row.append(card);
                });
            })
        }

        
        fetchRecipes();

        
        $("#button-addon2").click(function () {
            let searchQuery = $("#feild").val().trim(); 
            fetchRecipes(searchQuery);
        });

        
        let modal = `
            <div class="modal fade" id="recipeModal" tabindex="-1" aria-labelledby="recipeModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="recipeTitle"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <img id="recipeImage" src="" class="img-fluid mb-3" alt="">
                            <p id="recipeIngredients" class="fw-bold"></p>
                        </div>
                    </div>
                </div>
            </div>`;
        
        
        $("body").append(modal);

    
        $(document).on("click", ".recipe-card", function () {
            let name = $(this).data("name");
            let image = $(this).data("image");
            let ingredients = $(this).attr("data-ingredients");

            $("#recipeTitle").text(name);
            $("#recipeImage").attr("src", image);
            $("#recipeIngredients").text("Ingredients: " + ingredients);
        });
    });
