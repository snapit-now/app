<?php
// Firebase Server Key (from Firebase Console > Project Settings > Cloud Messaging tab)
define('AIzaSyCLmu0AVrrz88EUdi8HDtRapUHYbVZ-yHQ', 'BCOQGJQipo-tL_GnzHrGKqSG1ILb7dI2Gcu7BxNQJm57Uq08P9jRLJNvIPOENAdmCPem3kUlpmoSOGiLitjAHWw');

// Retrieve form data
$title = $_POST['title'];
$body = $_POST['body'];
$icon = $_POST['icon'];
$image = $_POST['image'];
$click_action = $_POST['click_action'];
$fcm_token = $_POST['fcm_token']; // Device FCM token (should come from your client JS)

// FCM endpoint
$url = 'https://fcm.googleapis.com/fcm/send';

// Prepare payload
$notification = array(
    'title' => $title,
    'body' => $body,
    'icon' => $icon,
    'image' => $image,
    'click_action' => $click_action
);

$data = array(
    'to' => $fcm_token,  // send to single device
    'notification' => $notification
);

$headers = array(
    'Authorization: key=' . API_ACCESS_KEY,
    'Content-Type: application/json'
);

// Curl POST to FCM
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$result = curl_exec($ch);
curl_close($ch);

// Output result for debug or show success
echo $result;
?>
