let btn = document.getElementById("btnClick");
let image = document.getElementById("image");
let quote = document.getElementById("quotes");
let download_btn = document.getElementById("downloadImage");
const url =
  "https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/pY3BnhPQYpTxasKfx.jpeg";

btn.addEventListener("click", function () {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then((res) => res.json())
    .then((result) => {
      // console.log(result);
      image.src = result.message;
    })
    .catch((err) => console.log(err));
});

async function getQuote() {
  try {
    const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
      headers: {
        "X-Api-Key": "ZNpG4uFX3y/W4EcKXeP34w==H3ZFynB0nyRQ3q4t",
      },
    });

    const data = await response.json();
    if (data && data.length > 0) {
      quote.innerText = `"${data[0].quote}"`;
    } else {
      quote.innerText = "No quotes found.";
    }
  } catch (error) {
    console.log(error);
  }
}
setInterval(getQuote, 5000);

download_btn.addEventListener("click", () => {
  let imgUrl = image.src;
  if (!imgUrl || imgUrl.includes("default.jpg")) {
    console.log("No image found");
    return;
  }
  downloadImage(imgUrl);
});

function downloadImage(imgUrl) {
  fetch(imgUrl)
    .then((response) => response.blob())
    .then((blob) => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      let filename = new URL(imgUrl).pathname.split("/").pop(); // More reliable filename extraction
      a.download = filename;
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((err) => console.log(err));
}
