$(document).ready(function () {
  const aadharInputs = [
    "#aadharFirstField",
    "#aadharSecondField",
    "#aadharThirdField",
  ];

  // Numeric-only filter for all fields
  function restrictToNumeric(input) {
    const currentValue = input.val();
    const numericRegex = /^[0-9]*$/;
    if (!numericRegex.test(currentValue)) {
      input.val(currentValue.replace(/[^0-9]/g, ""));
    }
    return input.val(); // Return cleaned value
  }

  // Validate and style input
  function validateInput(input, regex) {
    const currentValue = restrictToNumeric(input);
    if (currentValue === "" || regex.test(currentValue)) {
      input.css("border-color", ""); // Reset if empty or valid
    } else {
      input.css("border-color", "red");
    }
    return currentValue;
  }

  // Handle input for first field
  $("#aadharFirstField").on("input", function () {
    const currentInput = $(this);
    const currentValue = validateInput(currentInput, /^[2-9][0-9]{0,3}$/);
    if (currentValue.length === 4) {
      $("#aadharSecondField").focus();
    }
  });

  // Handle input for second and third fields
  $("#aadharSecondField, #aadharThirdField").on("input", function () {
    const currentInput = $(this);
    const currentValue = validateInput(currentInput, /^[0-9]{0,4}$/);
    if (
      currentValue.length === 4 &&
      currentInput.attr("id") === "aadharSecondField"
    ) {
      $("#aadharThirdField").focus();
    }
  });

  // Generic navigation for .inputs class
  $(".inputs").on("keyup", function (e) {
    const currentInput = $(this);
    const currentValue = restrictToNumeric(currentInput);

    if (currentValue.length === 4) {
      currentInput.next(".inputs").focus();
    } else if (currentValue.length === 0 && e.key === "Backspace") {
      currentInput.prev(".inputs").focus();
    }
  });

  // Limit length to 4
  $(".inputs").on("input", function () {
    const currentInput = $(this);
    const currentValue = restrictToNumeric(currentInput);
    if (currentValue.length > 4) {
      currentInput.val(currentValue.slice(0, 4));
    }
  });
});

$(document).ready(function () {
  // OTP Validation
  $(".otpInputs").on("input", function () {
    const currentInput = $(this);
    const currentValue = currentInput.val();

    const otpRegex = /^[0-9]{1}$/;
    if (!otpRegex.test(currentValue)) {
      currentInput.val("");
      return;
    }

    if (currentValue.length === 1) {
      const nextInput = currentInput.next(".otpInputs");
      if (nextInput.length) {
        nextInput.focus();
      }
    }
  });

  $(".otpInputs").on("keydown", function (e) {
    const currentInput = $(this);
    const currentValue = currentInput.val();
    const currentIndex = $(".otpInputs").index(currentInput);

    // Allow Backspace to work in all fields
    if (e.key === "Backspace") {
      if (currentValue.length === 0 && currentIndex > 0) {
        currentInput.prev(".otpInputs").focus(); // Move focus to the previous field
      }
      return; // Allow Backspace to delete the character
    }

    // Prevent typing in the 4th field if it already has a value
    if (currentIndex === 3 && currentValue.length === 1) {
      e.preventDefault();
    }
  });
});

$(document).ready(function () {
  // Get today's date
  let today = new Date();
  let year = today.getFullYear() - 18;
  let month = today.toISOString().slice(5, 10);

  $("#pastYear").val(`${year}-${month}`);
});

const form = document.querySelector(".form");
const num = document.getElementById("numberToConvert");
const converted = document.getElementById("convertedNumber");

const ones = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
};

const prefixes = {
  2: "twenty",
  3: "thirty",
  4: "forty", // corrected spelling from "fourty"
  5: "fifty",
  6: "sixty",
  7: "seventy",
  8: "eighty",
  9: "ninety",
};

// Using input event instead of form submit since there's no form submission
num.oninput = (event) => {
  event.preventDefault();

  if (+num.value in ones) {
    converted.value = ones[+num.value];
  }

  const numArray = num.value.split("");
  if (numArray.length === 2 && +num.value > 19) {
    converted.value = prefixes[numArray[0]] + " " + ones[numArray[1]];
  }

  if (numArray.length === 3) {
    if (+numArray[1] === 0) {
      converted.value =
        ones[numArray[0]] + " hundred " + " " + ones[numArray[2]];
    } else if (+numArray[1] < 2) {
      converted.value =
        ones[numArray[0]] +
        " hundred " +
        " " +
        ones[+[numArray[1], numArray[2]].join("")];
    } else {
      converted.value =
        ones[numArray[0]] +
        " hundred " +
        prefixes[numArray[1]] +
        " " +
        ones[numArray[2]];
    }
  }

  if (numArray.length === 4) {
    if (+numArray[1] === 0) {
      converted.value =
        ones[numArray[0]] +
        " thousand " +
        " " +
        ones[+[numArray[2], numArray[3]].join("")];
    } else if (+numArray[1] < 2) {
      converted.value =
        ones[numArray[0]] +
        " thousand " +
        ones[numArray[1]] +
        " hundred " +
        " " +
        ones[+[numArray[2], numArray[3]].join("")];
    } else {
      converted.value =
        ones[numArray[0]] +
        " thousand " +
        ones[numArray[1]] +
        " hundred " +
        prefixes[numArray[2]] +
        " " +
        ones[numArray[3]];
    }
  }
};
