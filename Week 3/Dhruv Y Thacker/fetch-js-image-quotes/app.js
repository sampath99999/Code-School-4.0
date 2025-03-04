const img_box = document.getElementById('img-box');
const new_button = document.getElementById('new-button');
const download_button = document.getElementById('downloadImage');
const quotes_change = document.getElementById('quotes-change');

new_button.addEventListener('click', getRandomImage);

async function getRandomImage() {
    try {
        let url = "https://pixabay.com/api/?key=48891266-f0d3267e6be45cdbbf748a606&q=yellow+flowers&image_type=photo&pretty=true";
        let response = await fetch(url);
        let data = await response.json();

        //console.log("hello"+data.hits)

        if (data.hits.length === 0) {
            console.error("No images found.");
            return;
        }

        let randomImage = data.hits[Math.floor(Math.random() * data.hits.length)];
        img_box.src = randomImage.largeImageURL;

        const Imgurl = randomImage.largeImageURL;

        let newDownloadButton = download_button.cloneNode(true);
        download_button.replaceWith(newDownloadButton);

        newDownloadButton.addEventListener('click', (event) => {
            event.preventDefault();
            downloadImage(Imgurl);
        });

    } catch (error) {
        console.error("Error fetching image:", error);
    }
}

// Quotes logic
setInterval(getQuote, 30000);

async function getQuote() {
    try {
        const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
            headers: {
                "X-Api-Key": "hhlMvaREahAIxr9Sphx6vQ==g01HL0Iw9jD0EVdK",
            },
        });

        const data = await response.json();
        quotes_change.innerText = `"${data[0].quote}"`;
    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

async function downloadImage(url) {
    try {
        await fetch(url)
            .then(response => response.blob())
            .then(blob => {
                let blobUrl = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.download = "random-image.jpg";
                a.href = blobUrl;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    } catch (error) {
        console.error("Error downloading image:", error);
    }

}
