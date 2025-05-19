<?php

require_once "response.php"; 

function validateFormFields($field)
{
    $key = $field["key"];
    $label = $field["label"];
    $value = $_POST[$key] ?? null;

    foreach ($field["rules"] as $rule) {

        if ($rule === "required") {
            if ($value === null || trim($value) === "") {
                sendErrorOutput("$label is required.", 400);
                return false;
            }
        }

        if (str_starts_with($rule, "min:")) {
            $minLength = (int) substr($rule, strpos($rule, ":") + 1);
            if (strlen($value) < $minLength) {
                sendErrorOutput("$label must contain at least $minLength characters.", 400);
                return false;
            }
        }

        if (str_starts_with($rule, "regex:")) {
            $pattern = substr($rule, strpos($rule, ":") + 1);
            if (!preg_match($pattern, $value)) {
                sendErrorOutput("Enter a valid $label.", 400);
                return false;
            }
        }

        if (str_starts_with($rule, "accepts:")) {
            $acceptedValues = explode(",", substr($rule, strpos($rule, ":") + 1));
            if (!in_array($value, $acceptedValues, true)) {
                $acceptedList = implode(", ", $acceptedValues);
                sendErrorOutput("$label must be one of: $acceptedList.", 400);
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
