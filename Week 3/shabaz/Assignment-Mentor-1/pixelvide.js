$(document).ready(function () {
  $(".view-btn").click(function () {
    let parentRow = $(this).closest(".details-box");
    let name = parentRow.find(".col:nth-child(2)").text().trim();
    let imageSrc = parentRow.find("img").attr("src");

    $("#memberModal .modal-title").text(name);
    $("#memberModal .modal-body img").attr("src", imageSrc);
    $("#memberModal").modal("show");
  });
  $("#careerLink").click(function(){
    $("#careerPage").load("careers.html")
  })
});
