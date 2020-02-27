<?php
    session_start();
    include('connMysql.php');

    $account = $_SESSION['user'];

    $sql_find_personal_information = "SELECT * FROM vocabularyisland.personal_information WHERE pi_account = :ACCOUNT";
    $stmt = $pdo->prepare($sql_find_personal_information);
    $stmt->bindValue(':ACCOUNT',$account); // 避免SQL injection。
    $stmt->execute() or exit("讀取personal_information資料表時，發生錯誤。"); //執行。 
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。

    /* 名字與卡數 */
    $name = $row[0]['pi_name'];
    $cardAmount = $row[0]['card_amount'];
    
    /* 闖關進度 */

?>