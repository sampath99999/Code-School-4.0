let img = document.querySelector("#image");
let btn = document.querySelector("btn");
let downloadBtn = document.querySelector("#downloadBtn");
let text = document.querySelector("#text");

async function getImage() {
  let Url = "https://dog.ceo/api/breeds/image/random";
  let response = await fetch(Url);
  let data = await response.json();
  img.src = data["message"];


}

downloadBtn.addEventListener("click", (event) => {
    downloadImage(document.getElementById("image").src);
  });

getImage();

let imageUrl = "";

async function generateImages() {
  const resp = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await resp.json();
  imageUrl = data["message"];
  document.getElementById("images").src = imageUrl;
}

generateImages();
setInterval(generateImages, 10000);

let Quote = "";

async function generateQuote() {
  const res = await fetch("https://qapi.vercel.app/api/random");
  const data = await res.json();
  console.log(data); 
  document.getElementById("text").textContent = data.quote;  
}

generateQuote();
setInterval(generateQuote, 10000);

function downloadImage(Url) {
  fetch(Url)
    .then((response) => response.blob())
    .then((blob) => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.download = Url.replace(/^.*[\\\/]/, "");
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}
