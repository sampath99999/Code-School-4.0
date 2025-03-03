async function fetchData(url) {
    try {
        let response = await fetch(url)
        let data = await response.json()
        return data
    }
    catch (err) {
        console.log(err.message)
    }

}
const btn = document.querySelector("#download")
const getRandomImage = async () => {
    try {
        let data = await fetchData("https://dog.ceo/api/breeds/image/random")
        const img = document.querySelector("#image")
        img.setAttribute("src", `${data.message}`)
        btn.addEventListener("click", () => {
            downloadImage(data.message)
        })
    }
    catch (err) {
        console.log(err.message)
    }

}
getRandomImage()
function downloadImage(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob)
            let a = document.createElement('a');
            a.download = url.replace(/^.*[\\\/]/, '');
            a.href = blobUrl;
            document.body.appendChild(a);
            a.click();
            a.remove();

        }).catch(err => {
            console.log(err.message)
        })
}

async function generateEverySecond() {
    try {
        let data = await fetchData("https://qapi.vercel.app/api/random")
        document.querySelector("#quote-container p").textContent = data.quote

        setInterval(() => {
            generateEverySecond()
        }, 10000);


    }

catch(err) {
    console.log(err.message)
}
} 
generateEverySecond()

// $(document).ready(function () {

//     $.get("https://qapi.vercel.app/api/random", function (data, status) {
//         console.log(status)
//         console.log(data)
//         $("#quote-container p").text(data.quote)
//     })


// })