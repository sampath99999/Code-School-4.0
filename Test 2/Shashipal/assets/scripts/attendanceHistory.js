let token = sessionStorage.getItem("token")
if (!token) {
    window.location.href = "index.html"
}

$(document).ready(function () {
    $("#navbar").load("navbar.html")
    $.ajax({
        url:"api/getEmployeeAttendance.php",
        type:"GET",
        headers:{
            "Authorization":sessionStorage.getItem("token")
        },
        success:function(res){
            console.log(res)
            let data = res.data
            data.forEach((element,index) => {
                $("tbody").append(`
                     <tr>
                        <td>${index+1}</td>
                        <td>${element.date}</td>
                        <td>${element.clock_in}</td>
                        <td>${element.clock_out}</td>    
                        </tr>
                    `)
            });
            
        },
        error:function(err){
            console.log(err)
        }
    })
})