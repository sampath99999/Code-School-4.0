const imageBox = document.getElementById("img");
const imageContainer=document.getElementById("Image");
const btn = document.getElementById("btn");
const url = "https://dog.ceo/api/breeds/image/random";

let getImage = () => {
    fetch(url)
    .then(data => data.json())
    .then(item => {
        imageBox.setAttribute("src", item.message);
    })
}
getImage();

function btnText(){
    let text= document.getElementById("btn");
    text.textContent="CHANGE IMAGE";
}

async function changeImage(){
    let response = await fetch(url);
    let data = await response.json();
    imageContainer.setAttribute("src", data.message);
}
changeImage();
setInterval(changeImage,5000);

async function changeText() {
  let response = await fetch("https://qapi.vercel.app/api/random");   
  let data = await response.json();
  const text=document.getElementById("text");
  text.textContent=data.quote;
}
changeText();
setInterval(changeText,5000);

const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', (event) => {
  event.preventDefault();
  downloadImage(imageBox.src);
})

function downloadImage(url) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
    let blobUrl = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.download = url.replace(/^.*[\\\/]/, '');
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  })
}
