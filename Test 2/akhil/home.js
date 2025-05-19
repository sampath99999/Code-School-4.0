$(document).ready(function () {
    if (!localStorage.getItem("token")) {
        window.location.href = "index.html";
    }

    $("#uploadForm").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this); 
        
        $.ajax({
            url: "/api/upload.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status === 200) {
                    const song = response.data;
                    const cardHTML = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow">
                                <img src="${song.image_url}" class="card-img-top" alt="Album Art">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${song.music_name}</h5>
                                    <p class="card-text text-muted">${song.artist}</p>
                                    <audio controls src="${song.file_path}" class="w-100 mt-auto"></audio>
                                </div>
                            </div>
                        </div>
                    `;
                    $("#library").append(cardHTML);
                    $("#uploadForm")[0].reset();
                    alert("Upload successful!");
                } else {
                    alert(response.message || "Upload failed");
                }
            },
            error: function (xhr) {
                try {
                    const err = JSON.parse(xhr.responseText);
                    alert(err.message || "Error uploading file");
                } catch {
                    alert("Something went wrong");
                }
            }
        });
    });
});