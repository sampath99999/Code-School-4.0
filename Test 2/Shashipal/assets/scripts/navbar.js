$(document).ready(function(){
    $.ajax({
        url:"api/getNavItems.php",
        type:"GET",
        headers:{
            'Authorization':sessionStorage.getItem("token")
        },
        success:function(res){
            if(res.data){
                res.data.map(item=>{
                    $("#navbarContent ul").append(`
                        <li class="nav-item me-4">
                <a class="nav-link fw-medium text-dark" href="${item.replace(" ","")}.html">${item}</a>
              </li>
                        `)
                })
            }
        },
        error:function(err){
            console.log(err)
        }
        
    })
    $(".logout").click(function(e){
        e.preventDefault()
        
        $.ajax({
            url:"api/logout.php",
            type:"POST",
            headers:{
            "Authorization":sessionStorage.getItem("token")
            },
            success:function(res){
                sessionStorage.clear()
                Swal.fire("Success",res.message,"success").then(()=>{
                    window.location.href="index.html"
                })

            }
        })
    })
})