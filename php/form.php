<?php
$name = htmlspecialchars($_POST["name"]);
$company = htmlspecialchars($_POST["company"]);
$about = htmlspecialchars($_POST["about"]);
$phone = htmlspecialchars($_POST["phone"]);
$email = htmlspecialchars($_POST["email"]);

$to = "hey@dzeya.com";
$subject = "Dzeya Lets talk";
$message = "\nName:$name \nCompany:$company \nAbout:$about \nPhone:$phone \nEmail:$email";
mail($to, $subject, $message, "Content-Type: text/plain; charset=utf-8 \r\n") or print "not send a message.";
?>