<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, PUT, DELETE, GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Memilih fungsi sesuai dengan metode HTTP yang diterima
switch ($method) {
    case 'POST':
        createTask();
        break;

    case 'PUT':
        completeTask();
        break;

    case 'DELETE':
        deleteTask();
        break;

    case 'GET':
        getTasks();
        break;

    default:
        echo json_encode(['message' => 'Permintaan tidak valid']);
        break;
}

// Fungsi untuk menambahkan tugas baru
function createTask()
{
    $data = json_decode(file_get_contents("php://input"));
    if (!empty($data->title)) {
        $conn = getConnection();
        $stmt = $conn->prepare("INSERT INTO todos (title) VALUES (?)");
        $stmt->bind_param('s', $data->title);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Tugas berhasil ditambahkan']);
        } else {
            echo json_encode(['message' => 'Tugas gagal ditambahkan']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['message' => 'Data tidak lengkap']);
    }
}

// Fungsi untuk mengubah status tugas menjadi selesai atau belum selesai
function completeTask()
{
    $data = json_decode(file_get_contents("php://input"));
    if (!empty($data->id) && isset($data->completed)) {
        $conn = getConnection();
        $stmt = $conn->prepare("UPDATE todos SET completed = ? WHERE id = ?");
        $stmt->bind_param('ii', $data->completed, $data->id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Status tugas diperbarui']);
        } else {
            echo json_encode(['message' => 'Gagal memperbarui status tugas']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['message' => 'Data tidak valid']);
    }
}

// Fungsi untuk menghapus tugas berdasarkan ID
function deleteTask()
{
    $data = json_decode(file_get_contents("php://input"));
    if (!empty($data->id)) {
        $conn = getConnection();
        $stmt = $conn->prepare("DELETE FROM todos WHERE id = ?");
        $stmt->bind_param('i', $data->id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Tugas berhasil dihapus']);
        } else {
            echo json_encode(['message' => 'Tugas gagal dihapus']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['message' => 'ID tidak valid']);
    }
}

// Fungsi untuk mengambil semua tugas atau satu tugas berdasarkan ID
function getTasks()
{
    $conn = getConnection();

    // Mengecek apakah ID disediakan dalam query string untuk mengambil satu tugas
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM todos WHERE id = ?");
        $stmt->bind_param('i', $id);
    } else {
        $stmt = $conn->prepare("SELECT * FROM todos");
    }

    $stmt->execute();
    $result = $stmt->get_result();

    // Mengembalikan tugas dalam format JSON jika data ditemukan
    if ($result->num_rows > 0) {
        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        echo json_encode($tasks);
    } else {
        echo json_encode(['message' => 'Tidak ada tugas ditemukan']);
    }

    $stmt->close();
    $conn->close();
}