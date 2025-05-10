
$(document).ready(function () {
    const jobData = [
                { "S.No": 1, "Job Id": 1001, Role: "Frontend Developer", Skills: "HTML, CSS, JavaScript and Bootstrap", Status: "Apply" },
                { "S.No": 2, "Job Id": 1002, Role: "Senior Developer", Skills: "Problem Solving, Technical, Soft Skills and Database", Status: "Apply" },
                { "S.No": 3, "Job Id": 1003, Role: "Software Engineer(Java)", Skills: "Java, Core-Java, Adv-Java, SpringBoot and Database", Status: "Apply" },
                { "S.No": 4, "Job Id": 1004, Role: "Software Testing", Skills: "Manual testing, Automation testing, Agile testing and SDLC", Status: "Apply" },
                { "S.No": 5, "Job Id": 1005, Role: "DevOps", Skills: "Linux fundamentals, Continuous integration, Scripting and Automation", Status: "Apply" },
                { "S.No": 6, "Job Id": 1006, Role: "Analyst", Skills: "Data visualization, Problem solving and Collaboration", Status: "Apply" },
                { "S.No": 7, "Job Id": 1007, Role: "Backend Developer", Skills: "Java/Python/Php, Version control systems and CI/CD pipelines", Status: "Apply" },
                { "S.No": 8, "Job Id": 1008, Role: "Business Analyst", Skills: "Analytical thinking, Communication and Data analysis", Status: "Apply" },
                { "S.No": 9, "Job Id": 1009, Role: "Digital Marketing", Skills: "Email marketing, Content marketing, Advertising and Social media", Status: "Apply" },
                { "S.No": 10, "Job Id": 1010, Role: "Data Science", Skills: "Data visualization, Statistics, Machine learning, SQL and Natural language processing", Status: "Apply" }
            ];

   
            function renderJobTable() {
                
                jobData.forEach((job, index) => {
            
                    $("#jobTableBody").append(`
                        <tr id="row-${index}">
                            <td>${job["S.No"]}</td>
                            <td>${job["Job Id"]}</td>
                            <td>${job.Role}</td>
                            <td>${job.Skills}</td>
                            <td><button class="btn btn-primary apply-btn" onclick="deleteJob(${index})">Apply</button></td>
                        </tr>
                    `);
                });
            }

    // Delete function
    window.deleteJob = function (index) {
        Swal.fire({
            title: "Plz give us Confirmation",
            text: "Want to apply?!",
            icon: "warning",
            showCancelButton: true, 
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                jobData.splice(index, 1); // Remove from data array
                $(`#row-${index}`).remove(); // Remove row from DOM
                Swal.fire("Applied and deleted from job list!", "", "success");
            }else{
                Swal.fire("Not Applied!", "", "Thanks For your Conformation");
            }
        });
    };
    // Add Job Functionality
    $("#jobForm").submit(function (e) {
        e.preventDefault();
        
        let jobId = $("#jobId").val().trim();
        let jobRole = $("#jobRole").val().trim();
        let jobSkills = $("#jobSkills").val().trim();
        let isValid = true;

        //job id must be a number
        if (!/^\d+$/.test(jobId)) {
            
            $("#jobId").addClass("is-invalid");
            $("#jobIdError").text("Job ID must be a valid number.").addClass("text-danger");
            isValid = false;
        } else {
            $("#jobId").removeClass("is-invalid").addClass("is-valid");
            $("#jobIdError").text(" valid").addClass("text-success");
        }

        // Job Role must be greater than 3
        if (jobRole.length < 3) {
            $("#jobRole").addClass("is-invalid");
            $("#jobRoleError").text("Job role must be at least 3 characters long.").addClass("text-danger");
            isValid = false;
        } else {
            $("#jobRole").removeClass("is-invalid").addClass("is-valid");
            $("#jobRoleError").text("valid").addClass("text-success");
        }

        // Job Skills must be greater than 3
        if (jobSkills.length < 3) {
            $("#jobSkills").addClass("is-invalid");
            $("#jobSkillsError").text("Please enter valid skills.").addClass("text-danger");
            isValid = false;
        } else {
            $("#jobSkills").removeClass("is-invalid").addClass("is-valid");
            $("#jobSkillsError").text("valid").addClass("text-success");
        }

        if (isValid) {
            jobData.push({
                "S.No": jobData.length + 1,
                "Job Id": jobId,
                Role: jobRole,
                Skills: jobSkills,
                Status: "Apply"
            });
            Swal.fire({
                title: "Job Added",
                icon: "success",
                confirmButtonText: "yes",
            })

            renderJobTable(); 

            $("#addJobModal").modal("hide"); 
        } else {
            Swal.fire({
                title: 'Form Validation Error',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    // Search Functionality
    $("#searchInput").on("keyup", function () {
        let searchTerm = $(this).val().toLowerCase();
        $("#jobTableBody tr").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm)>-1);
        });
    });

    // Initial render
    renderJobTable();
});

