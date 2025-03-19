$(document).ready(function () {
    let apiKey = "b4AD_5AM6D563GCiWDNtKfYN6QrjNtbmwsjI_OFMvzk";
    let searchInput = $("#searchBtn");
    let imageContainer = $("#imageContainer");



    function fetchRandomImages() {
        let apiUrl = `https://api.unsplash.com/photos/random?count=50&client_id=${apiKey}`;

        $.ajax({
            url: apiUrl,
            type: "GET",
            success: function (data) {
                console.log("API Response:", data);
                
                data.forEach(photo => {
                    let imgElement = `
                        <div class="image-card">
                            <img src="${photo.urls.small}" alt="${photo.alt_description}" class="img-fluid">
                            <p class="caption">${Caption(photo.alt_description || "No Description")}</p>
                            <p class="photographer">By: <a href="${photo.user.links.html}" target="_blank">${photo.user.name}</a></p>
                        </div>
                    `;
                    imageContainer.append(imgElement);
                });
            },
            error: function (error) {
                console.error("Error fetching images:", error);
                imageContainer.append("<p>Failed to load images.</p>");
            }
        });
    }

    //Caption length to fixed size
    function Caption(caption){
        let words = caption.split(" ")
        if(words.length > 5){
            return words.slice(0,5).join(" ")+"...."
        }else{
            return caption;
        }
    }

    // Fetch images when the page loads
    fetchRandomImages();

    function searchImages(query) {
        let apiUrl = `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${apiKey}`;

        console.log("searching images for:", query); 

        $.ajax({
            url: apiUrl,
            type: "GET",
            success: function (data) {
                console.log("API Response:", data); 
                imageContainer.empty();

                data.results.forEach(photo => {
                    let imgElement = `
                        <div class="image-card">
                            <img src="${photo.urls.small}" alt="${photo.alt_description}" class="img-fluid">
                            <p class="caption">${Caption(photo.alt_description || "No Description")}</p>
                            <p class="photographer">By: <a href="${photo.user.links.html}" target="_blank">${photo.user.name}</a></p>
                        </div>
                    `;
                    imageContainer.append(imgElement);
                });
            },
            error: function (error) {
                console.error("Error fetching images:", error);
            }
        });
    }

    searchInput.on("keyup", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            let query = searchInput.val().trim();
            if (query !== "") {
                searchImages(query);
            }
        }
    });
});
