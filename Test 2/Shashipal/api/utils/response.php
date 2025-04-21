<?php

function sendErrorOutput($message="Something went wrong!", $statusCode= 400) {
    http_response_code($statusCode);
    header("Content-Type:application/json");
    echo json_encode(["status"=>false,"message"=>$message]);
    exit;
}
function sendSuccessOutput($message= "success",$data=null, $statusCode= 200) {
    http_response_code($statusCode);
    header("Content-Type:application/json");
    echo json_encode(["status"=>true,"message"=>$message,"data"=>$data]);
    exit;
}
