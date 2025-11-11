<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

define('ADMIN_EMAIL', 'ellalianaa06@gmail.com');
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@example.com'); 
define('SMTP_PASSWORD', 'your-app-password'); 
define('FROM_EMAIL', 'noreply@baliwanderway.com');
define('FROM_NAME', 'Bali Wanderway Bookings');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

$firstName = sanitize($_POST['firstName'] ?? '');
$lastName = sanitize($_POST['lastName'] ?? '');
$email = sanitize($_POST['email'] ?? '');
$phone = sanitize($_POST['phone'] ?? '');
$packageType = sanitize($_POST['packageType'] ?? '');
$date = sanitize($_POST['date'] ?? '');
$guests = sanitize($_POST['guests'] ?? '');
$location = sanitize($_POST['location'] ?? 'Not specified');
$message = sanitize($_POST['message'] ?? 'No additional message');

$errors = [];

if (empty($firstName)) $errors[] = 'First name is required';
if (empty($lastName)) $errors[] = 'Last name is required';
if (empty($email) || !validateEmail($email)) $errors[] = 'Valid email is required';
if (empty($phone)) $errors[] = 'Valid phone number is required';
if (empty($packageType)) $errors[] = 'Package type is required';
if (empty($date)) $errors[] = 'Preferred date is required';
if (empty($guests) || !is_numeric($guests)) $errors[] = 'Valid number of guests is required';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

$packages = [
    'photo-half' => 'Photo Session - Half Day',
    'video-full' => 'Video Production - Full Day',
    'combo' => 'Combo Package - Photo & Video'
];
$packageName = $packages[$packageType] ?? $packageType;

$locations = [
    'canggu' => 'Canggu',
    'seminyak' => 'Seminyak',
    'kuta' => 'Kuta',
    'ubud' => 'Ubud',
    'uluwatu' => 'Uluwatu',
    'denpasar' => 'Denpasar',
    'nusa-dua' => 'Nusa Dua',
    'multiple' => 'Multiple Locations',
    'custom' => 'Custom Location'
];
$locationName = $locations[$location] ?? $location;

$mail = new PHPMailer(true);


//defining email body BEFORE TRY {} 

//for admin
 $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #667eea; }
            .value { margin-top: 5px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Booking Request</h2>
                <p>Bali Wanderway</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>$firstName $lastName</div>
                </div>
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'>$email</div>
                </div>
                <div class='field'>
                    <div class='label'>Phone:</div>
                    <div class='value'>$phone</div>
                </div>
                <div class='field'>
                    <div class='label'>Package:</div>
                    <div class='value'>$packageName</div>
                </div>
                <div class='field'>
                    <div class='label'>Preferred Date:</div>
                    <div class='value'>$date</div>
                </div>
                <div class='field'>
                    <div class='label'>Number of Guests:</div>
                    <div class='value'>$guests</div>
                </div>
                <div class='field'>
                    <div class='label'>Preferred Location:</div>
                    <div class='value'>$locationName</div>
                </div>
                <div class='field'>
                    <div class='label'>Additional Message:</div>
                    <div class='value'>$message</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";

//for user
    $confirmBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Thank You for Your Booking!</h1>
            </div>
            <div class='content'>
                <p>Dear $firstName,</p>
                <p>We've received your booking request for <strong>$packageName</strong> on <strong>$date</strong>.</p>
                <p>Our team will review your request and get back to you within 24 hours to confirm availability and discuss the details.</p>
                <p>If you have any immediate questions, feel free to reply to this email.</p>
                <p>Looking forward to creating amazing memories with you in Bali!</p>
                <p><strong>The Bali Wanderway Team</strong></p>
            </div>
        </div>
    </body>
    </html>
    ";


try {
    //booking notif on admins email
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = SMTP_PORT;

    $mail->setFrom(FROM_EMAIL, FROM_NAME);
    $mail->addAddress(ADMIN_EMAIL);
    $mail->addReplyTo($email, "$firstName $lastName");

    $mail->isHTML(true);
    $mail->Subject = "New Booking Request from $firstName $lastName";
    $mail->Body =  $emailBody; //defined before try
    $mail->AltBody = "New Booking Request\n\nName: $firstName $lastName\nEmail: $email\nPhone: $phone\nPackage: $packageName\nDate: $date\nGuests: $guests\nLocation: $locationName\nMessage: $message";

    $mail->send();
        
    //confirmation email to user
    $confirmMail = new PHPMailer(true);
    $confirmMail->isSMTP();
    $confirmMail->Host = SMTP_HOST;
    $confirmMail->SMTPAuth = true;
    $confirmMail->Username = SMTP_USERNAME;
    $confirmMail->Password = SMTP_PASSWORD;
    $confirmMail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $confirmMail->Port = SMTP_PORT;
    
    $confirmMail->setFrom(FROM_EMAIL, FROM_NAME);
    $confirmMail->addAddress($email);
    $confirmMail->isHTML(true);
    $confirmMail->Subject = "Booking Confirmation - Bali Wanderway";

    
    $confirmMail->Body = $confirmBody; //defined before try
    $confirmMail->send();
    
    echo json_encode(['success' => true, 'message' => 'Booking submitted successfully']);
    
}

// not called ??? >> STILL NOT CALLED FOR
catch (Exception $e) {
    error_log("Email error: " . $e->getMessage()); //should be right, changed $mail->ErrorInfo
    echo json_encode(['success' => false, 'message' => 'Unable to send booking. Please try again later.']);
}
?>