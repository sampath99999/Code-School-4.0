<?php

function sendErrorOutput($message = "Something went wrong", $status = 400)
{
    echo json_encode(value: ["status" => false, "message" => $message, "data" => null]);
    exit;
}

function sendSuccessOutput($message = "success", $data = null)
{
    echo json_encode(["status" => true, "message" => $message, "data" => $data]);
    exit;
}
