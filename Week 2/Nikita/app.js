let realAmount =1000;
let userAmount;
let continuecondition=true;
while(continuecondition){
    let options=prompt("select options : \n 1 for withdraw \n 2 for Deposit \n 3 for check balance");
    if(options==1){
        userAmount =prompt("please Enter Amount");
       
        userAmount=Number(userAmount);
        realAmount=Number(realAmount);
        if(userAmount>realAmount){
            alert("You have not that much amount");
        }
        else{
            realAmount=realAmount-userAmount;
            alert(`save amount in your account is ${realAmount}`);
        }
       
    }
    else if(options==2){
        userAmount =prompt("please Enter Amount");
       
        userAmount=Number(userAmount);
        realAmount = Number(realAmount);
        realAmount+=userAmount;
       alert(`your final amount is ${realAmount}`)
    }
    else if(options==3){
        alert(`amount = ${realAmount}`);
    }
    else{
        continuecondition=false;
    }
}

