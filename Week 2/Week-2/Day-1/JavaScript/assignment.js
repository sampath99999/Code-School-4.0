let balance=200;
let limitDeposit=1000;
let option;

while(true){
    option=prompt("Please select any option \n 1.Withdraw \n 2.Deposit \n 3.Check Balance \n 4.Exit")
    switch (option){
        case 1:alert("Withdraw Success");
        break;
        case 2:alert("Deposit Your Money here");
        break;
        case 3:alert("Have 200$ ");
        break;
        case 4:alert("Visit again ");
        break;
        default:alert("please Visit your bank")
    }
    
}



// if(option==1){
//     userAskedBalance=prompt("enter your balance to withdraw: ")
//     if(userAskedBalance<=balance){
//         alert("Withdraw Success");
//     }else{
//         alert("please check your balance");
//     }
// }

// else if(option==2){
//     userDeposit=prompt("how much you want to deposit:")
//     if(limitDeposit<=userDeposit){
//         alert("we can not deposit this money please visit the bank.ThankYou")
//     }
//     else{
//         alert("your amount has been deposited")
//     }
// }

// else if(option==3){
//     alert(`You Have $${balance}`)
// }

// else if(option==4){
//     alert("Thank You Visit Again!!!")
// }

// else{
//     alert("Thank You !!!")
// }