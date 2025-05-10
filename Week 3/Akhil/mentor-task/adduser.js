if(!localStorage.getItem('id')){
  localStorage.setItem('id','31')
}
let id = Number(localStorage.getItem('id'))
let errormsg = ''
const formfields = [
  {
    id : 'firstName',
    lable : 'firstName',
    rules : ['required','min:3','max:12']
  },
  {
    id : 'lastName',
    lable : 'lastName',
    rules : ['required','min:3','max:12']
  },
  {
    id : 'maidenName',
    lable : 'maidenname',
    rules : []
  },
  {
    id : 'age',
    lable : 'age',
    rules : ['required']
  },
  {
    id : 'birthDate',
    lable : 'birthDate',
    rules : ['required']
  },
  {
    id : 'gender',
    lable : 'gender',
    rules : ['required']
  },
  {
    id : 'email',
    lable : 'email',
    rules : ['required','email']
  },
  {
    id : 'username',
    lable : 'username',
    rules : ['required','min:5','max:24']
  },
  {
    id : 'address',
    lable : 'address',
    rules : ['required']
  },
  {
    id : 'phone',
    lable : 'phone',
    rules : ['required','phone']
  },
  {
    id : 'companyName',
    lable : 'companyname',
    rules : ['required','min:5','max:24']
  },
  {
    id : 'department',
    lable : 'department',
    rules : ['required','min:5','max:24']
  },
]

$('#close').click(function(){
  $('#firstName').val('') 
        $('#lastName').val('')
        $('#maidenName').val('')
        $('#age').val('') 
        $('#birthDate').val('') 
        $('#gender').val('')
        $('#email').val('')
        $('#username').val('')
        $('#address').val('')
        $('#phone').val('') 
        $('#companyName').val('') 
        $('#department').val('') 
})

function formValidation(field){
  let input = $(`#${field.id}`)
  let element = input.val();
  let valid = true
  for(let rule of field.rules){
    if(rule == 'required'){
      if(!element || element.length === 0){
        $(`.error${field.lable}`).text('Required')
        valid = false
      }
    }
    if(rule.includes('min')){
      let split = rule.split(':')
      let min = split[1];
      if(element.length < Number(min)){
        $(`.error${field.lable}`).text('Required min 5 characters')
        valid = false
      }
    }
    if(rule.includes('max')){
      let split = rule.split(':')
      let max = split[1];
      if(element.length > Number(max)){
        $(`.error${field.lable}`).text('max 24 characters')
        valid = false
      }
    }
    if(rule == 'phone'){
      let phoneregx =  /^(\+91-|\+91|0)?\d{10}$/
      if(!phoneregx.test(element)){
        $(`.error${field.lable}`).text('Invalid number')
        valid = false
      }
    }
    if(rule == 'email'){
      let emailregx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
      if(!emailregx.test(element)){
        $(`.error${field.lable}`).text('Invalid email')
        valid = false
      }
    }
  }
  if(!valid){
    input.css("border", "2px solid red"); 
  }
  else{
    input.css("border", "");
    $(`.error${field.lable}`).text('')
  }
  return valid;
}


$('#submitUser').click(function(event){
  event.preventDefault();
  let status = true
  for(let field of formfields){
    status = formValidation(field) && status ;
  }
  console.log(status)
  if(status){
    let formData = {}; 
    formData.id = id;
    formfields.forEach(field => {
      formData[field.id] = $(`#${field.id}`).val(); 
    });
    formData.company = {
      name: $(`#companyName`).val(),  
      department: $(`#department`).val()
    };
    formData.address = {
      address: $(`#address`).val(),  
    };
    let data = JSON.parse(localStorage.getItem('result'))
    data.users.push(formData)
    localStorage.setItem('result',JSON.stringify(data));
    $.ajax({ 
      url : 'https://dummyjson.com/users/add',
      method :'POST',
      contentType : 'application/json',
      data : JSON.stringify(formData),
      success : function(user){
        console.log(user)
        console.log(formData)
        $('#tableBody').prepend(
          `<tr id='row${id}' class="bg-white"> 
          <th scope="row">${id}</th>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.maidenName}</td>
            <td>${user.age}</td>
            <td>${user.birthDate}</td>
            <td>${user.gender}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${user.address.address}</td>
            <td>${user.phone}</td>
            <td>${user.company.name}</td>
            <td>${user.company.department}</td>
            <td><button class="btn btn-success" onclick="editRow(${id})"> Edit</button> <button class="btn btn-warning" onclick="deleteRow(${id})">Delete</button></td>
            </tr>`
        )
        id++;
        localStorage.setItem('id',JSON.stringify(id));
        Swal.fire({
          title: "Added!",
          text: "Added the User Successfully",
          icon: "success"
        });
        $('#firstName').val('') 
        $('#lastName').val('')
        $('#maidenName').val('')
        $('#age').val('') 
        $('#birthDate').val('') 
        $('#gender').val('')
        $('#email').val('')
        $('#username').val('')
        $('#address').val('')
        $('#phone').val('') 
        $('#companyName').val('') 
        $('#department').val('') 
      },
      error : function(error){
        console.log(error)
        Swal.fire({
          title: "Action not Done",
          text: "Something went Wrong",
          icon: "error"
        });
        $('#firstName').val('') 
        $('#lastName').val('')
        $('#maidenName').val('')
        $('#age').val('') 
        $('#birthDate').val('') 
        $('#gender').val('')
        $('#email').val('')
        $('#username').val('')
        $('#address').val('')
        $('#phone').val('') 
        $('#companyName').val('') 
        $('#department').val('') 
      }
    })
  }
  else{
    console.log('please fill the details')
    Swal.fire({
      title: "Fill the details correctly",
      text: "Action can't be done",
      icon: "error"
    });
  }
})
