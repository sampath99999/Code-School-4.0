const formfields = [
    {
        'id' : 'email',
        'label' : 'email',
        'rules' : ['required'] 
    },
    {
        'id' : 'password',
        'label' : 'password',
        'rules' : ['required'] 
    },
]
function form_validation(field){
    let value = $(`#${field.id}`).val();
    let valid = true;
    for(let rule of field.rules){
        if(rule == 'required'){
            if(!value || value == ""){
                $(`#error${field.label}`).text('Please fill this field');
                valid = false;
            }
        }
    }
    return valid;
}

function login(event){
        event.preventDefault();
        let status = true;
        for(let field of formfields){
            let formfield = form_validation(field)
            status = status && formfield;
        }
    
        if(status){
            $.ajax({
                url : "/api/login.php",
                method : 'POST',
                data : {
                    email : $('#email').val(),
                    password : $('#password').val()
                },
                headers : {
                   "Content-Type": 'application/x-www-form-urlencoded'
                },
                success : function(response){
                    result = JSON.parse(response)
                    localStorage.setItem('token',result.data.token)
                    localStorage.setItem('firstname',result.data.firstname)
                    console.log(result);
                    console.log(localStorage.getItem('token'));
                    console.log(localStorage.getItem('firstname'));
                    window.location.href = "home.html";
                },
                error : function(error){
                    console.log(error);
                    let msg = JSON.parse(error.responseText);
                    $('#msg').text(msg.message);
    
                }
            })
        }
        else{
            console.log("please fill it");
        }
    }

