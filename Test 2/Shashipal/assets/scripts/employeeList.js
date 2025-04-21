let token = sessionStorage.getItem("token")
if(!token){
    window.location.href="index.html"
}
$(document).ready(function(){
    $("#navbar").load("navbar.html")
    $.ajax({
        url:"api/getAllEmployees.php",
        type:"GET",
        headers:{
            "Authorization":sessionStorage.getItem("token")
        },
        success:function(res){
            if(res){
                console.log(res)
                let data = res.data
                console.log(data)
                data.forEach((element,index) => {
                    $("tbody").append(`
                        <tr>
                        <td>${index+1}</td>
                        <td>${element.name}</td>
                        <td>${element.email}</td>
                        <td>${element.date_of_birth}</td>
                        <td>${element.phone_number}</td>
                        <td>${element.address}</td>

                        
                        </tr>
                        `)
                });
            }

        },
        error:function(err){
            Swal.fire("Error",err.responseJSON.message,"error")
        }

    })
})