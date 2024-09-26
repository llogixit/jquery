<?php
 

$raw_post_data = file_get_contents('php://input');
$raw_post_array = explode('&', $raw_post_data);
$myPost = array();
foreach ($raw_post_array as $keyval) {
  $keyval = explode ('=', $keyval);
  if (count($keyval) == 2)
     $myPost[$keyval[0]] = urldecode($keyval[1]);
}

$req = "";
foreach ($myPost as $key => $value) {        
  
        $value = urlencode($value);
   
   $req .= "&$key=$value";
}


$servername = "sql311.infinityfree.com";
$username = "if0_36768748";
$password = "NLGOyKjpEaVL";
$dbname = "if0_36768748_llogixit";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO buyers (email)
VALUES ('".$req."')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
 
?>