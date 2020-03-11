<?php
    session_start();
    include('connMysql.php');

    
    $information = array();                      // 最後回傳的資訊陣列。

    $account = $_SESSION["user"];             // 使用者帳號。

    $sql = "SELECT picture_filename,vocabulary,background_color,border_color FROM vocabularyisland.card WHERE author = :author";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':author',$account);

     /* 回傳狀態。*/
    if ($stmt->execute()) {
        $information = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將資料照索引順序一一全部取出，並以陣列放入。
        
     } else {
        $information = $stmt->error;
     }

    $pdo = null;
    echo json_encode($information);

?>