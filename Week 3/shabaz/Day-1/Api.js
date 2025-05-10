let img = document.getElementById('image');
let btn = document.getElementById('button');

async function getDogImage(){
    const resp = await fetch("https://dog.ceo/api/breeds/image/random ");
    const data = await resp.json();
    document.getElementById('image').src = data["message"];
    document.getElementById('downloadImage').myLink = data["message"];

}

getDogImage()


async function quotes() {
    const url='https://api.api-ninjas.com/v1/quotes';
    const myHeader={
        'X-Api-Key' :'3ItVjURtb0vsbLGm40TY71QAbWAHzsLmqZSqtYT3'
    };
    const resp= await fetch( url ,{
        method: "GET",
        headers: myHeader
    })
    const data = await resp.json();
    document.getElementById('quotes').innerHTML = data[0].quote;

}

quotes()
setInterval(quotes,10000)



function downloadImage(){
    const url = document.getElementById('downloadImage').myLink

    fetch(url)
    .then(resp => resp.blob())
    .then(blob =>{
        let blobUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download = url.replace(/^.*[\\\/]/, '');
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
}

downloadImage()