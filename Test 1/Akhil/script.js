const legalHeir = [
    {
        id: 'name',
        label: 'Name',
        rules: ['required', 'min:3', 'max:12']
    },
    {
        id: 'relation',
        label: 'Relation',
        rules: ['required', 'min:3', 'max:12']
    },
    {
        id: 'phone',
        label: 'Phone',
        rules: ['required', 'phone']
    },
    {
        id: 'bankno',
        label: 'bankno',
        rules: ['required', 'bankno']
    },
    {
        id: 'confirmbank',
        label: 'confirmbank',
        rules: ['required', 'confirmbank']
    },
    {
        id: 'ifsc',
        label: 'IFSC',
        rules: ['required', 'ifsc']
    }
];

function validation(field) {
    let value = $(`#${field.id}`).val();
    let valid = true;

    for (let rule of field.rules) {
        if (rule === 'required') {
            if (!value || value.trim() === '') {
                valid = false;
                $(`.error${field.label}`).text('Required');
                continue;
            }
        }
        if (rule.startsWith('min:')) {
            let min = Number(rule.split(':')[1]);
            if (value.length < min) {
                valid = false;
                $(`.error${field.label}`).text(`Minimum ${min} characters required`);
            }
        }
        if (rule.startsWith('max:')) {
            let max = Number(rule.split(':')[1]);
            if (value.length > max) {
                valid = false;
                $(`.error${field.label}`).text(`Maximum ${max} characters allowed`);
            }
        }
        if (rule === 'phone') {
            let regex = /^[1-9]\d{9}$/;
            if (!regex.test(value)) {
                valid = false;
                $(`.error${field.label}`).text('Invalid Number');
            }
        }
        if (rule === 'bankno') {
            let regex = /^\d{12}$/;
            if (!regex.test(value)) {
                valid = false;
                $(`.error${field.label}`).text('Invalid Bank Number');
            }
        }
        if (rule === 'confirmbank') {
            if (value !== $('#bankno').val()) {
                valid = false;
                $(`.error${field.label}`).text('Bank numbers do not match');
            }
        }
        if (rule === 'ifsc') {
            let regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
            if (!regex.test(value)) {
                valid = false;
                $(`.error${field.label}`).text('Invalid IFSC code');
            }
        }
    }

    if (valid) {
        $(`.error${field.label}`).text('');
    }
    return valid;
}

$('#searchifsc').click(function (event) {
    event.preventDefault(); 
    let ifscValue = $('#ifsc').val();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscValue)) {
        $('.errorIFSC').text('Invalid IFSC code');
        return;
    } else {
        $('.errorIFSC').text('');
    }

    $.ajax({
        url: `https://ifsc.razorpay.com/${ifscValue}`,
        method: 'GET',
        success: function (response) {
            console.log(response);
            $('.bankname').text(response.BANK)
            $('.bankbranch').text(response.BRANCH)
            
        },
        error: function (error) {
            console.log(error);
            alert('Invalid IFSC code');
        }
    });
});

$('#close, #close1').click(function () {
    $('#name, #relation, #phone, #bankno, #confirmbank, #ifsc').val('');
    $('.error').text('');
    $('.bankname').text('')
            $('.bankbranch').text('')
});

$(document).ready(function () {
    $('#submit').click(function (event) {
        event.preventDefault(); 
        let status = true;
        for (let field of legalHeir) {
            status = validation(field) && status;
        }
        if (status) {
            alert('Submission successful');
            $('#name, #relation, #phone, #bankno, #confirmbank, #ifsc').val('');
            $('.error').text('');
        }
    });
});
