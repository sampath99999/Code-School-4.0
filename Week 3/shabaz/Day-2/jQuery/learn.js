// $(document).ready(function () {
//   $("#p").on("click", function () {
//     $(this).hide();
//     console.log("working 1");
//   });
// //   $("#p").click(function () {
// //     $(this).hide();
// //     console.log("working 1");
// //   });
//   $("#test").dblclick(function () {
//     $(this).hide();
//     console.log("working 2");
//   });
//   $(".test").mouseenter(function(){
//       $(this).hide();
//   });
//   $("#p4").mouseleave(function(){
//       $(this).hide();
//   });
//   $("button").hover(function(){
//       // alert("u clicked")
//       $(this).hide();
//   },
//   function(){
//       // alert("Byee");
//       $(this).show();
//   });
//   $("#inp").focus(function(){
//       $(this).css({"background-color" : "red","height":"120px"});
//   });
// });


$(document).ready(function(){
    // $("#btn").click(function(){
    //     $("#div1").fadeIn();
    //     $("#div2").fadeIn("slow");
    //     $("#div3").fadeIn(2000);
    // });
    // $("#fadeOut").click(function(){
    //     $("#div1").fadeOut();
    //     $("#div2").fadeOut("slow");
    //     $("#div3").fadeOut(2000);
    // });
    // $("button").click(function(){
    //     $("#div1").fadeToggle();
    //     $("#div2").fadeToggle("slow");
    //     $("#div3").fadeToggle(2000);
    // });
    $("button").click(function(){
        $("#div1").fadeTo("slow",0.15);
        $("#div2").fadeTo("slow",0.4);
        $("#div3").fadeTo("slow",0.7);
    });
});