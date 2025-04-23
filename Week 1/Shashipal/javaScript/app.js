let balance=0
while (true){
    let option  = prompt(` select option
        1.Withdraw
        2.Deposit
        3.Check Balance
        4.Exit`)
        if(option=='1'){
            if(balance==0){
                alert('Your balance is zero,Cannot Withdraw')
            }
            else{
                let amount=Number(prompt("enter amount"))
            if (amount>balance){
                alert('Your balance is less than required amount')

            }else{
                balance-=amount
                alert("Transaction Complete")
            }
            }
            
        }
        else if(option=='2'){
            let amount =Number(prompt("Enter Deposit Amount"))
            if(amount<0){
                alert("Enter Valid amount")

            }else{
                balance+=amount
                alert("Amount Deposited")
            }
        }
        else if(option=='3'){
            alert(`Your balance is ${balance}`)
        }
        else if(option=='4'){
            break
        }
        else{
            alert("Enter Valid Option")
        } 
        

}