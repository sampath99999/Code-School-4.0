async function getImage() {
  let url = "https://dog.ceo/api/breeds/image/random";

  let myObject = await fetch(url);

  let myImage = await myObject.json();

  document.getElementById("demo").src = myImage["message"];

  document.getElementById("download").myLink = myImage["message"];
}

//////////////////////////////////////////////////////////

function downloadImage() {
  let url = document.getElementById("download").myLink;

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.download = url.replace(/^.*[\\\/]/, "");
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}

////////////////////////////////////////////////////////////////

setInterval(getQuote, 10000);

async function getQuote() {
  let url = "https://api.api-ninjas.com/v1/quotes";

  let myHeaders = {
    "X-Api-Key": "5x2srT/C0bxSxJpCHSb2+w==O0ti8GOIP7oPG2M6",
  };

  let response = await fetch(url, {
    method: "GET",
    headers: myHeaders,
  });

  let data = await response.json();

  document.getElementById("quote").innerHTML = '" ' + data[0].quote + ' "';
}
