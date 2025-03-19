
$(document).ready(function(){
  if(!localStorage.getItem('accessToken')){
    window.location.href = 'index.html'
  } 
  else{
    $('#signOut').click(function(){
      localStorage.clear();
      if(!localStorage.getItem('accessToken')){
        window.location.href = 'index.html'
      }
    })
  
    if(localStorage.getItem('accessToken')){
      console.log(localStorage.getItem('accessToken'))
      $.ajax({
        url: 'https://dummyjson.com/auth/me',
        method : 'GET',
        contentType : 'application/json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
      },
      success : function(response){
        console.log('success',response)
        $('#userImg').attr('src',response.image)
        $('#brand').append(`Hi, ${response.firstName} ${response.lastName}`)
      },
      error : function(error){
        console.log(error)
      }
      })
    }
    if(localStorage.getItem('accessToken')){
      $.ajax({
        url: 'https://dummyjson.com/auth/user',
        method: 'GET',
        contentType : 'application/json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
      },
        success: function(response){
          console.log(response);
          if(!localStorage.getItem('result')){
            localStorage.setItem('result', JSON.stringify(response));
          }
          let result = JSON.parse(localStorage.getItem('result'))
          let userItems = result.users; 
          for (let user of userItems) {
            if(user.maidenName==''){
              $('#tableBody').append(
              `<tr id='row${user.id}' class="bg-white"> 
                <th scope="row">${user.id}</th>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td></td>
                <td>${user.age}</td>
                <td>${user.birthDate}</td>
                <td>${user.gender}</td>
                <td>${user.email}</td>
                <td>${user.username}</td>
                <td>${user.address.address}</td>
                <td>${user.phone}</td>
                <td>${user.company.name}</td>
                <td>${user.company.department}</td>
                <td>
                  <button class="btn btn-success" onclick="editRow(${user.id})">Edit</button> 
                  <button class="btn btn-warning" onclick="deleteRow(${user.id})">Delete</button>
                </td>
              </tr>`
            );
            }
            else{
              $('#tableBody').append(
                `<tr id='row${user.id}' class="bg-white"> 
                  <th scope="row">${user.id}</th>
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
                  <td>
                    <button class="btn btn-success" onclick="editRow(${user.id})">Edit</button> 
                    <button class="btn btn-warning" onclick="deleteRow(${user.id})">Delete</button>
                  </td>
                </tr>`
              );
            }
            $('#dropdown-age').click(function(){
              $('#tableSearch').val('');
              $('#tableSearch').attr('disabled', false);
              $('#tableSearch').attr('placeholder','Filter Age ex : 25-30')
              $('#tableSearch').on("keyup",function(){
                var value = $(this).val().split('-');
                $("#tableBody tr").filter(function() {
                  var age = Number($(this).find('td').eq(3).text());
                  let valid = false
                  if(age >= Number(value[0]) && age <= Number(value[1])) valid = true
                  $(this).toggle(valid || value == '')
                });
              })
            })

            $('#dropdown-gender').click(function(){
              $('#tableSearch').val('');
              $('#tableSearch').attr('disabled', false);
              $('#tableSearch').attr('placeholder','Filter Gender')
              $('#tableSearch').on("keyup",function(){
                var value = $(this).val().toLowerCase();
                $("#tableBody tr").filter(function() {
                  $(this).toggle($(this).find('td').eq(5).text().toLowerCase() == value || value == '')
                });
              })
            })

            $('#dropdown-company').click(function(){
              $('#tableSearch').val('');
              $('#tableSearch').attr('disabled', false);
              $('#tableSearch').attr('placeholder','Filter company')
              $('#tableSearch').on("keyup",function(){
                var value = $(this).val().toLowerCase();
                $("#tableBody tr").filter(function() {
                  $(this).toggle($(this).find('td').eq(10).text().toLowerCase() == value || value == '')
                });
              })
            })

            // $('#tableSearch').on("keyup",function(){
            //   var value = $(this).val().toLowerCase();
            //   $("#tableBody tr").filter(function() {
            //     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            //   });
            // })
            
          }
        },
        error: function(error){
          console.log("Error fetching data:", error);
        }
      });
    }
    else{
      return
    }
   
  }
});



