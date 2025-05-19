<?php

require_once "response.php";

function validateRequest($request) {
    if ($_SERVER["REQUEST_METHOD"] != $request) {
        sendErrorOutput("Request not Found", 404);
    }
    return true;
}