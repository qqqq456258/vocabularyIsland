<?php
    session_start();
    include('connMysql.php');
    
    $information = array();         //最後回傳的資訊陣列。

    $title = $_GET['title'];        //標題。
    $account = $_SESSION['user'];   //使用者帳號。


    /* 從標題抓取關卡資訊(代碼) */
    $sql_find_level_code = "SELECT * FROM vocabularyisland.title WHERE title_name = :title_name";
    $stmt = $pdo->prepare($sql_find_level_code);
    $stmt->bindValue(':title_name',$title); // 避免SQL injection。
    $stmt->execute() or exit("讀取 title 資料表時，發生錯誤。"); //執行。 
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。
    $title_code = $row[0]['title_code'];
    $kind_of_theme = $row[0]['kind_of_theme'];


    /* 抓取自主練習的總數量 */
    $sql_find_practice_amount = "SELECT Count(*) AS num FROM vocabularyisland.practice WHERE kind_of_title = :kind_of_title AND kind_of_theme = :kind_of_theme";
    $stmt = $pdo->prepare($sql_find_practice_amount);
    $stmt->bindValue(':kind_of_title',$title_code); // 避免SQL injection。
    $stmt->bindValue(':kind_of_theme',$kind_of_theme); // 避免SQL injection。
    $stmt->execute() or exit("讀取 practice 資料表時，發生錯誤。"); //執行。 
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。
    $information['amount_practices'] = $row[0]['num']; // 總自主練習數量。


    /* 抓取每個自主練習的標題 ( 依照關卡代碼順序由小至大 ) */
    $title_practices = array();
    for( $i=0 ; $i<$information['amount_practices'] ; $i++ ){
        $sql_find_practice_title = "SELECT pt_name FROM vocabularyisland.practice WHERE kind_of_title = :kind_of_title AND kind_of_theme = :kind_of_theme AND pt_code = :pt_code";
        $stmt = $pdo->prepare($sql_find_practice_title);
        $stmt->bindValue(':kind_of_title',$title_code); // 避免SQL injection。
        $stmt->bindValue(':kind_of_theme',$kind_of_theme); // 避免SQL injection。
        $stmt->bindValue(':pt_code',$i); // 避免SQL injection。
        $stmt->execute() or exit("讀取 practice 資料表時，發生錯誤。"); //執行。 
        $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。
        $title_practices[$i] = $row[0]['pt_name'];
    }
    $information['title_practices'] = $title_practices; // 每個自主練習的名稱。

    
    /* 抓取使用者每個自主練習的星數 ( 依照關卡代碼順序由小至大 ) */
    $star_practices = array();
    /* 抓取使用者每個自主練習的代碼 ( 依照關卡代碼順序由小至大 ) */
    $code_practices = array();
    for( $i=0 ; $i<$information['amount_practices'] ; $i++ ){
        $sql_find_practice_amount = "SELECT ps_star FROM vocabularyisland.practice_status WHERE ps_account = :ps_account AND ps_theme = :ps_theme AND ps_title = :ps_title AND ps_practice = :ps_practice";
        $stmt = $pdo->prepare($sql_find_practice_amount);
        $stmt->bindValue(':ps_account',$account); // 避免SQL injection。
        $stmt->bindValue(':ps_theme',$kind_of_theme); // 避免SQL injection。
        $stmt->bindValue(':ps_title',$title_code); // 避免SQL injection。
        $stmt->bindValue(':ps_practice',$i); // 避免SQL injection。
        
        $stmt->execute() or exit("讀取 practice_status 資料表時，發生錯誤。"); //執行。 
        $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一全部取出，並以陣列放入$row。
        if(count($row) == 0){
            $star_practices[$i] = 0;
        }else{
            $star_practices[$i] = $row[0]['ps_star'];
        }
        $code_practices[$i] = $kind_of_theme."-".$title_code."-".$i;
    }
    $information['star_practices'] = $star_practices; // 每個自主練習進度(星數)。
    $information['code_practices'] = $code_practices; // 每個自主練習進度(代碼)。




    $pdo = null;

    echo json_encode($information);

    /* 闖關進度 */
    // 等單字庫及關卡確定後再說
?>