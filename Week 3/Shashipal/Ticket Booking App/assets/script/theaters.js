$("#sidebar").load("sidebar.html")
let role=localStorage.getItem("role")
if(!role){
    window.location.href="userLogin.html"
}
if(role!=="admin"){
    window.location.href="movies.html"
}
let theaters = JSON.parse(localStorage.getItem("theaters")) || [];
localStorage.setItem("theaters", JSON.stringify(theaters));
console.log(JSON.parse(localStorage.getItem("theaters")));
$(document).ready(function () {
   theaters.map((theater,index)=> {
        console.log(theater)
        $("#theaters .row").append(`
           
               <div class="col-12 w-100 p-3 bg-white  rounded">
                        <h5 class="mb-0 text-break">${theater.theaterName}</h5>
                        <p>${theater.address}</p>
                        <div class="text-end">
                            <button class="btn btn-dark mx-1 py-0 edit-btn" data-id=${index}>Edit <i class="fas fa-pen ps-2"></i></button>
                            <button class="btn btn-danger mx-1 py-0 delete-btn">Delete <i class="fas fa-trash ps-2"></i></button>
                        </div>
                    </div>
              
                  `)
    })
    $(".delete-btn").click(function(e){
        e.preventDefault()
        let theaterName=$(this).closest(".col-12").find("h5").text()
        theaters=theaters.filter(theater=>theater.theaterName!==theaterName)
        localStorage.setItem("theaters",JSON.stringify(theaters))
        $(this).closest(".col-12").remove()
      })
    $(".edit-btn").click(function(e){
        e.preventDefault()
        let id=$(this).data("id")
        window.location.href=`addTheater.html?id=${id}`
    })
})