$(document).ready(function () {
  const apiKey = "m-Bs1ERX6tffxdW3rjA9wNLBZHgi6dHHFOXL8o1_LYg";
  let pageNumber = 1;
  let isLoading = false;

  fetchRandomImages();

  function fetchRandomImages() {
    const url = `https://api.unsplash.com/photos/random?count=56&client_id=${apiKey}`;
    $.ajax({
      url: url,
      method: "GET",
      success: function (data) {
        displayImages(data);
      },
      error: function () {
        alert("Error fetching random images!");
      },
    });
  }

  function searchImages(query) {
    const url = `https://api.unsplash.com/search/photos?page=${pageNumber}&query=${query}&client_id=${apiKey}`;

    if (isLoading) return;
    isLoading = true;

    $.ajax({
      url: url,
      method: "GET",
      success: function (data) {
        displayImages(data.results);
        isLoading = false;
      },
      error: function () {
        alert("Error fetching images!");
        isLoading = false;
      },
    });
  }

  function displayImages(images) {
    images.forEach((image) => {
      const cardHtml = `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card h-100 border-0 shadow-sm search-result-card">
                        <img src="${
                          image.urls.small
                        }" class="card-img-top " height="400px" width="auto" alt="${
        image.alt_description || "Image"
      }" />
                        <div class="card-body p-2">
                            <h6 class="card-title mb-0 text-truncate">${
                              image.description || "No description"
                            }</h6>
                            <p class="card-text small text-muted w-auto">${
                              image.user?.portfolio_url
                                ? `<a href="${image.user.portfolio_url}" target="_blank">${image.user.name}</a>`
                                : "Unsplash"
                            }</p>
                        </div>
                    </div>
                </div>`;

      $("#searchResults").append(cardHtml);
    });
  }

  $("#searchInput").on("input", function () {
    const query = $(this).val();
    $("#searchResults").empty();
    pageNumber = 1;
    searchImages(query);
  });

  $(window).on("scroll", function () {
    if (
      $(window).scrollTop() + $(window).height() >=
      $(document).height() - 100
    ) {
      pageNumber++;
      const query = $("#searchInput").val();
      searchImages(query);
    }
  });
});
