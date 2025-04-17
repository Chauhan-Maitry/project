<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "crud_db"; 

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case "GET":
        if ($action == "read") {
            $sql = "SELECT * FROM users ORDER BY id DESC";
            $result = $conn->query($sql);
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            echo json_encode($users);
        }
        break;

    case "POST":
        if ($action == "create") {
            $data = json_decode(file_get_contents("php://input"), true);

            $name = $conn->real_escape_string($data['name']);
            $email = $conn->real_escape_string($data['email']);
            $mobile = $conn->real_escape_string($data['mobile']);
            $age = (int)$data['age'];

            $sql = "INSERT INTO users (name, email, mobile, age) VALUES ('$name', '$email', '$mobile', $age)";
            if ($conn->query($sql)) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "message" => $conn->error]);
            }
        }
        break;

    case "PUT":
        if ($action == "update" && isset($_GET['id'])) {
            $id = (int) $_GET['id'];
            $data = json_decode(file_get_contents("php://input"), true);

            $name = $conn->real_escape_string($data['name']);
            $email = $conn->real_escape_string($data['email']);
            $mobile = $conn->real_escape_string($data['mobile']);
            $age = (int)$data['age'];

            $sql = "UPDATE users SET name='$name', email='$email', mobile='$mobile', age=$age WHERE id=$id";
            if ($conn->query($sql)) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "message" => $conn->error]);
            }
        }
        break;

    case "DELETE":
        if ($action == "delete" && isset($_GET['id'])) {
            $id = (int) $_GET['id'];
            $sql = "DELETE FROM users WHERE id=$id";
            if ($conn->query($sql)) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "message" => $conn->error]);
            }
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid request"]);
        break;
}

$conn->close();
?>
