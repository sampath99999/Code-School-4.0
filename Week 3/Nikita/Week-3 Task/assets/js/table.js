$(document).ready(function () {
    const teamMembers = [
        { name: "Prathyush", designation: "CEO & FOUNDER", img: "assets/images/Team/Pratyush.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Yogesh", designation: "CTO", img: "assets/images/Team/second.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Rohith", designation: "AVP", img: "assets/images/Team/third.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Narshimha", designation: "SR. GENERAL MANAGER", img: "assets/images/Team/fourth.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Aashritha", designation: "AVP", img: "assets/images/Team/fifth.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Imran", designation: "VP Tech", img: "assets/images/Team/sixth.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Praneeth", designation: "VP Tech", img: "assets/images/Team/seventh.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Nitin", designation: "PRINCIPAL DEVOPS ENGINEER", img: "assets/images/Team/eight.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Prakash Sah", designation: "TECH LEAD", img: "assets/images/Team/nine.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" },
        { name: "Tanmayee", designation: "SR. GENERAL MANAGER", img: "assets/images/Team/ten.PNG", description: "Passionate about leading teams and delivering high-quality software.", linkedin: "https://www.linkedin.com/company/pixelvide-web-solutions/posts/?feedView=all" }
    ];
    /*For Table */
    teamMembers.forEach((member, index) => {
        $("#data-container").append(`
           <div class="row border-bottom p-3 align-items-center text-center text-md-start shadow-lg p-3 mb-5 bg-white rounded" id="member-${index}">
                    
                    <div class="col-12 col-md-2"><strong>${member.name}</strong></div>
                    
                    
                    <div class="col-12 col-md-2">${member.designation}</div>
                    
                   
                    <div class="col-12 col-md-2 text-center">
                        <img src="${member.img}" class="img-fluid rounded" alt="${member.name}" style="max-width: 100px; height: auto;">
                    </div>
                    
                   
                    <div class="col-12 col-md-4">${member.description}</div>
                    
                   
                    <div class="col-12 col-md-2 d-flex flex-column flex-sm-row justify-content-center gap-2 ">
                        <a href="${member.linkedin}" target="_blank" class="btn  fw-bold btn-sm text-light" style="background-color:#6870F3" >LinkedIn</a>
                        <button class="btn  fw-bold btn-sm text-light" style="background-color:#6870F3" onclick="showDetails('${member.name}', '${member.designation}', '${member.img}', '${member.description}')">Display</button>
                        <button class="btn  fw-bold btn-sm text-light" style="background-color:#6870F3" onclick="deleteMember(${index})">Delete</button>
                    </div>
                </div>
           
        `);
    });
    /*This one for about Us page's Core Team cards*/ 
    teamMembers.forEach((team) => {
        console.log(team)
        $("#coreTeam").append(`
            <div class="col-12 col-md-4 ms-5 ms-md-0">
                <div class="card" style="width: 18rem; margin-bottom: 15px;">
                    <img class="card-img-top" src="${team.img}" alt="${team.name}" style="max-width: 300px; height:250px;">
                    <div class="card-body">
                        <h6>${team.name}</h6>
                        <p class="card-text">${team.designation}</p>
                    </div>
                </div>
            </div>
        `);
    });
  
});

/*After Clicking display btn of table page modal will open*/ 
function showDetails(name, designation, img, description) {
    $("#modal-body-content").html(`
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Designation:</strong> ${designation}</p>
        <img src="${img}" class="img-fluid rounded mb-2" alt="${name}">
        <p><strong>Description:</strong> ${description}</p>
    `);
    $("#infoModal").modal("show");
}

/*Delete */
function deleteMember() {
    $(`#member-${index}`).remove(); 
    Swal.fire("Deleted!");
}
