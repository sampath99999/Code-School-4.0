let GetImage=document.getElementById('fetchimage');
let GetQuote=document.getElementById('quote');
let btn = document.getElementById('downloadImage');
const url = "https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/pY3BnhPQYpTxasKfx.jpeg";

function fetchImage(){
    fetch("https://dog.ceo/api/breeds/image/random")
    .then(res=>res.json())
    .then((data)=>{
        GetImage.src=data.message
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('ABC')
            downloadImage(data.message);
          })
        
          
    })
    .catch(error => console.error("Error fetching image:", error));
}
fetchImage()



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
  .catch(error => console.error("Error downloading image:", error));
}



  
  

setInterval(
    function quote(){
        fetch("https://qapi.vercel.app/api/random")
        .then(res=>res.json())
        .then(data=>GetQuote.innerHTML=data.quote)
        .catch(error => console.error("Error fetching quote:", error));
    }
,10000)

