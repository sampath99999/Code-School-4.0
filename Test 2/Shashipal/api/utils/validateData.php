<?php

require_once "response.php";
function validateFormFields($field)
{

    foreach ($field["rules"] as $rule) {
        if ($rule == "required") {
            if (!isset($_POST[$field["key"]]) || !$_POST[$field["key"]]) {
                sendErrorOutput($field["label"] . " is required", 400);
                return false;
            }
        }
        if (str_contains($rule, "min")) {
            $minLength = substr($rule, strpos($rule, ":") + 1);
            if (strlen($_POST[$field["key"]]) < (int)$minLength) {
                sendErrorOutput($field["label"] . " must contain at least" . $minLength . "characters", 400);
                return false;
            }
        }
        if (str_contains($rule, "regex")) {
            $pattern = substr($rule, strpos($rule, ":") + 1);
            if (!preg_match($pattern, $_POST[$field["key"]])) {
                sendErrorOutput("Enter Valid " . $field["label"], 400);
            }
        }
        if (str_contains($rule, "accepts")) {
            $values = substr($rule, strpos($rule, ":") + 1);
            if (!str_contains($values, $_POST[$field["key"]])) {
                sendErrorOutput($field["label"] . " accepts only" . $values, 400);
                return false;
            }
        }
    }
    return true;
}

function validateData($formFields)
{

    $status = true;
    foreach ($formFields as $field) {
        $status = validateFormFields($field) && $status;
    }
    return $status;
}
