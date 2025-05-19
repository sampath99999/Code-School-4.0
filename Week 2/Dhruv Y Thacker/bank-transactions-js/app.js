let balance = 10000;
let entteredAmount;
let continueLoop =true;
while (continueLoop) {
    let option = prompt(" option 1 for withdraw \n option 2 for deposit \n option 3 for check balance \n option 4 for exit \n")

    switch (option) {
        case "1":
            entteredAmount = prompt("enter amount to withdraw ")
            entteredAmount = Number(entteredAmount);
            balance = Number(balance);
            if (entteredAmount < balance) {
                balance = balance - entteredAmount;
                alert(`amount detucted ${entteredAmount}so total balance now is ${balance}`)
            } else {
                alert("insufficient balance")
            }
        break;

        case "2":
            entteredAmount = prompt("enter amount to deposit")
            entteredAmount = Number(entteredAmount);
            balance = Number(balance);
            balance = balance + entteredAmount;
            alert(`amount ${entteredAmount} is added sucesssfully so total balance ${balance}`)

        break;

        case "3":
            alert(`your balance is ${balance}`)
        break;

        case "4":  
        default:
            continueLoop = false;
            break;
    }
}
