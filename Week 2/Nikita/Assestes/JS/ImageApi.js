//Image
async function fetchRandomImage() {
    let response = await fetch(`https://api.unsplash.com/photos/random?client_id=x55RHs7NE31lpmxnXtsFaAFgZET-0jBZrOiwltNEptQ`)
    let data = await response.json()
    imgPlace.src = data.urls.regular;

}
//Quotes
async function fetchRandomQuotes() {
    let response = await fetch(`https://api.api-ninjas.com/v1/quotes`, {
        headers: { 'X-Api-Key': 'TpmNwvl2B9rhOk6gUeGMLQ==WobPryGTgydNvQvp' }
    });

    let data = await response.json();
    document.getElementById("Quotes").innerText = data[0].quote;
    fetchBtn.addEventListener("click", fetchRandomQuotes);
    setInterval(fetchRandomQuotes, 7000);

}

//download
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("downloadImage").addEventListener("click", (event) => {
        event.preventDefault();
        let imgUrl = document.getElementById("imgPlace").src; 
        if (imgUrl) {
            downloadImage(imgUrl);
        } else {
            console.log("No image available to download!");
        }
    });
});
function downloadImage(imgUrl) {
    fetch(imgUrl)
        .then(response => response.blob())  // Convert to a blob
        .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);  // Create a downloadable link
            let a = document.createElement("a");
            a.href = blobUrl;
            a.download = "random_image.jpg"; // Set a default filename
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error("Error downloading image:", error));
}








