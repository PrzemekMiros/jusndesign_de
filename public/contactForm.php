<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("content-type: application/json; charset=utf-8");

$is_ajax = isset($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) === "xmlhttprequest";
$success_redirect = "/de/formular-gesendet/";

$email = isset($_POST["visitor_mail"]) ? trim($_POST["visitor_mail"]) : "";
$name = isset($_POST["visitor_name"]) ? trim($_POST["visitor_name"]) : "";
$message = isset($_POST["visitor_msg"]) ? trim($_POST["visitor_msg"]) : "";

if (empty($email) || empty($name)) {
    $json = array("status" => 0, "msg" => "<p class='status_err'>Prosze wypelnic wymagane pola.</p>");
    echo json_encode($json);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $json = array("status" => 0, "msg" => "<p class='status_err'>Prosze podac prawidlowy adres email.</p>");
    echo json_encode($json);
    exit;
}

$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit";
$message_body = "=== FORMULARZ KONTAKTOWY ===\n\n";
$message_body .= "Imie i nazwisko: $name\n";
$message_body .= "Email: $email\n";
$message_body .= "Wiadomosc: $message\n";
$message_body .= "\nData wyslania: " . date("Y-m-d H:i:s") . "\n";

$email_sent = mail("przemekmiros@ore4x4.pl", "Formularz kontaktowy - $name", $message_body, $headers);

if ($email_sent && !$is_ajax) {
    header("Location: " . $success_redirect);
    exit;
}

if ($email_sent) {
    $success_message = "Vielen Dank für Ihre Kontaktaufnahme. Wir antworten so schnell wie möglich.";
    $json = array("status" => 1, "msg" => "<p class='status_ok'>$success_message</p>");
} else {
    $json = array("status" => 0, "msg" => "<p class='status_err'>Wystapil problem z wyslaniem formularza.</p>");
}

echo json_encode($json);
exit;
?>
