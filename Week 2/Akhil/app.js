function inputfunc(){
  const firstname = document.getElementById("firstname").value;
  if(firstname.length<5){
    document.getElementById("f_namespan").innerHTML = `First name must be at <strong> least 5 characters </strong> Long`;
    return false;
  }
  else{
    document.getElementById("f_namespan").innerHTML = "";
    return true;
  }

}

function inputfunc1(){
  const lastname = document.getElementById("lastname").value;
  if(lastname.length<5){
    document.getElementById("l_namespan").innerHTML = `Last name must be at <strong> least 5 characters </strong> Long`;
    return false;
  }
  else{
    document.getElementById("l_namespan").innerHTML = "";
    return true;
  }

}

function inputfunc2(){
  const email = document.getElementById("email").value;
  if(email.indexOf("@gmail.com")<2){
    document.getElementById("e_span").innerHTML = `<strong> Invalid Email </strong>`;
    return false;
  }
  else{
    document.getElementById("e_span").innerHTML = "";
    return true;
  }
}


function inputfunc4(){
  const phone = document.getElementById("phone").value;
  if(phone.length<10 ){
    document.getElementById("p_no").innerHTML = `Phone number must be at <strong> least 10 Numbers </strong>Long`;
    return false;
  }
  else{
    document.getElementById("p_no").innerHTML = "";
    return true;
  }
}

function inputfunc5(){
  const password = document.getElementById("password").value;
  if(password.length<6){
    document.getElementById("pass").innerHTML = `Password must be at <strong> least 6 characters </strong>Long`;
    return false;
  }
  else{
    document.getElementById("pass").innerHTML = "";
    return true;
  }
}

function inputfunc3(){
  const gender1 = document.getElementById("male");
  const gender2 = document.getElementById("female");
  if(gender1.checked || gender2.checked){
    return true;
  }
  return false;
}
document.getElementById("button").addEventListener("click",event => {
  
  if(inputfunc() && inputfunc1() && inputfunc2() && inputfunc3() && inputfunc4() && inputfunc5()){
    event.preventDefault();
    Swal.fire({
      title: "Success!",
      text: "Registration Successful",
      icon: "success"
    });
    
  }
  else{
    event.preventDefault();
    Swal.fire({
      title: "Error!",
      text: "Please fill all the fields",
      icon: "error"
    });
  }
});
