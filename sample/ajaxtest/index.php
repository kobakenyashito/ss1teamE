<?php
if (!empty($_POST["name"])) {

    //ここに処理が入ります
    $name = $_POST["name"];
    $age = $_POST["age"];
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=test;charset=utf8','root','');
    } catch (PDOException $e) {
        exit('データベース接続失敗。'.$e->getMessage());
    }
    $stmt = $pdo -> prepare("INSERT INTO testtb (name, age) VALUES (:name, :age)");
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindValue(':age', $age, PDO::PARAM_INT);
    $stmt->execute();
    $stmt = $pdo -> prepare("SELECT name, age FROM testtb WHERE name = :name");
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->execute();
    //header('Content-type: application/json');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}