let token = sessionStorage.getItem("token")
if (!token) {
    window.location.href = "index.html"
}
$(document).ready(function () {
    $("#navbar").load("navbar.html")
    let date = new Date()
    let hours = String(date.getHours()).padStart(2,0)
    let minutes = String(date.getMinutes()).padStart(2,0)
    $("#date").val(date.toISOString().slice(0, 10))
    $("#time").val(`${hours}:${minutes}`)
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function success(position) {
        $("#latitude").val(position.coords.latitude)
        $("#longitude").val(position.coords.longitude)
    }

    function error() {
        alert("Sorry, no position available.");
    }
    getLocation()
    $("#clock-in").click(function(e){
        e.preventDefault()
        $.ajax({
            url:"api/clockIn.php",
            type:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
                "Authorization":sessionStorage.getItem("token")
            },
            data:{
                date:$("#date").val(),
                clockIn:$("#time").val(),
                latitude:$("#latitude").val(),
                longitude:$("#longitude").val(),
                remark:$("#remark").val()
            },
            success:function(res){
                console.log(res)
                Swal.fire("Success",res.message,"success").then(()=>{
                    window.location.reload()
                })
            },
            error:function(err){
                Swal.fire("Error",err.responseJSON.message,"error")
            }

        })
    })
})