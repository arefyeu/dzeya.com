<?php	// Файлы phpmailerrequire 'class.phpmailer.php';require 'class.smtp.php';$phone = $_POST['faqPhone'];// Настройки$mail = new PHPMailer;// Кодировка$mail->CharSet = 'UTF-8';//$mail->isSMTP(); $mail->Host = 'ssl://smtp.gmail.com';  $mail->SMTPAuth = true;                      $mail->Username = 'XXXX'; // Ваш логин в GMail.ru. Именно логин, без @gmail.com$mail->Password = 'XXXX'; // Ваш пароль$mail->SMTPSecure = 'ssl';                            $mail->Port = 465;//$mail->setFrom('email2@gmail.com'); // Ваш Email$mail->setFrom($phone); // Ваш Email$mail->FromName = $phone; $mail->addAddress('soledar1984@gmail.com'); // Email получателя//$mail->addAddress('example@gmail.com'); // Еще один email, если нужно.                                 // Письмо$mail->isHTML(true); // Заголовок письма$mail->Subject = "Если еще есть вопросы"; // Текст письма$message = "Телефон : " . $phone ;$mail->Body = $message;// Результатif(!$mail->send()) {    echo 'Message could not be sent.';    echo 'Mailer Error: ' . $mail->ErrorInfo;} else {    echo '';}?>