<?php
    session_start();
    include('connMysql.php');
    
    $information = array();
    $account = $_SESSION['user'];

    /* 使用者姓名 */
    $sql = "SELECT pi_name FROM vocabularyisland.personal_information WHERE pi_account = :ACCOUNT";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':ACCOUNT',$account); // 避免SQL injection。
    $stmt->execute() or exit("讀取personal_information資料表時，發生錯誤。"); //執行。 
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。
    $information['name'] = $row[0]['pi_name'];

    /* 字卡數量 */
    $sql_find_personal_information = "SELECT count(*) as num FROM vocabularyisland.card WHERE author = :ACCOUNT";
    $stmt = $pdo->prepare($sql_find_personal_information);
    $stmt->bindValue(':ACCOUNT',$account); // 避免SQL injection。
    $stmt->execute() or exit("讀取card資料表時，發生錯誤。"); //執行。 
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。

    $information['cardAmount'] = $row[0]['num'];


    $pdo = null;
    echo json_encode($information);

    /* 闖關進度 */
    // 等單字庫及關卡確定後再說。


?>