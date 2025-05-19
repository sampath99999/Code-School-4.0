<?php

require_once("../api/config/validatetoken.php");
require_once("../api/config/db.php");
require_once("../api/config/response.php");

session_start();
$user = validate_token();
$_SESSION['id'] = $user['id'];
Response::showSuccessMessage("data fetched",200,$user);