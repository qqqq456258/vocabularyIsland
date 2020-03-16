<?php

session_start();

include('connMysql.php');
$account = $_SESSION['user'];
$amount_of_finish_practice = 0;
$theme = $_POST['theme'];
$title = $_POST['title'];

     
    /* 抓取子主題中的自主練習之總數。*/
    $sql = "SELECT count(*) as num FROM vocabularyisland.practice WHERE kind_of_theme = :kind_of_theme AND kind_of_title = :kind_of_title";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':kind_of_theme',$theme);
    $stmt->bindValue(':kind_of_title',$title);
    $stmt->execute() or exit("practice，發生錯誤。"); //執行。
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。
    $amount_of_practice = $row[0]['num'];


    for($i = 0 ; $i < $amount_of_practice ; $i++){
    
        $sql = "SELECT (count(done_time)) as finished FROM (SELECT (count(*)) as done_time FROM vocabularyisland.practice_status WHERE ps_account = :ps_account AND ps_theme = :ps_theme AND ps_title = :ps_title AND ps_practice = :ps_practice) as someone WHERE done_time > 2";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':ps_account',$account);
        $stmt->bindValue(':ps_theme',$theme);
        $stmt->bindValue(':ps_title',$title);
        $stmt->bindValue(':ps_practice',$i);
        $stmt->execute() or exit("讀取資料表時，發生錯誤。"); //執行。 
        $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。
        if( $row[0]['finished'] == 1 ){
            $amount_of_finish_practice++;
        }
        
    }

    $information['percentage'] = round(($amount_of_finish_practice / $amount_of_practice)*100);

    echo json_encode($information);

    
?>