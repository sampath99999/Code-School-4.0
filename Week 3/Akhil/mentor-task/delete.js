function deleteRow(id){
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });


      if(id<=30){
        $.ajax({
          url : `https://dummyjson.com/users/${id}`,
          method : 'DELETE',
          success : function(response){
            console.log('successfully deleted',response)
            let data = JSON.parse(localStorage.getItem('result'))
            data.users.forEach((item,index ) => {
              if(item.id == id){
                data.users.splice(index,1)
              }
            });
            localStorage.setItem('result',JSON.stringify(data))
    
            $(`#row${id}`).remove()
          },
          error : function(error){
            console.log('cant delete',error)
          }
        })
      }
      else{
        let data = JSON.parse(localStorage.getItem('result'))
        data.users.forEach((item,index ) => {
            if(item.id == id){
              data.users.splice(index,1)
          }
        });
        localStorage.setItem('result',JSON.stringify(data))
        $(`#row${id}`).remove()
      }
    }
  });
}


