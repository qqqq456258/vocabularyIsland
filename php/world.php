<?php
    session_start();
    include('connMysql.php');
    
    $information = array();
    $account = $_SESSION['user'];


    /* 名字、字卡數量 */
    $sql_find_personal_information = "SELECT * FROM vocabularyisland.personal_information WHERE pi_account = :ACCOUNT";
    $stmt = $pdo->prepare($sql_find_personal_information);
    $stmt->bindValue(':ACCOUNT',$account); // 避免SQL injection。
    $stmt->execute() or exit("讀取personal_information資料表時，發生錯誤。"); //執行。 
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。

    $information['name'] = $row[0]['pi_name'];
    $information['cardAmount'] = $row[0]['card_amount'];

    echo json_encode($information);

    /* 闖關進度 */
    // 等單字庫及關卡確定後再說


?>