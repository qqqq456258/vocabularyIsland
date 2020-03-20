<?php
    session_start();
    include('connMysql.php');

    
    $information = array();                   // 最後回傳的資訊陣列。
    $code = $_POST['code'];                   // 執行代碼。
    $account = $_SESSION["user"];             // 使用者帳號。

    if($code == 0){     // 抓背包裡的字卡資訊。
        $sql = "
        SELECT card.picture_filename,card.vocabulary,card.background_color,card.border_color,vocabulary_library.vl_part_of_speech,vocabulary_library.vl_definition
        FROM vocabularyisland.card
        INNER JOIN vocabularyisland.vocabulary_library
        ON card.vocabulary = vocabulary_library.vl_vocabulary
        WHERE card.author = :author
        ";

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
        
        
        
    }else{              // 抓背包裡的字卡的標準發音。
        
        $vocabulary = $_POST['word'];
        
        $vocabulary = trim($vocabulary); //去除字尾的空白
        $vocabulary = preg_replace('/\s/','%20', $vocabulary); // 將字串內的空白從 ASCII Value 替換成 URL-encode ，再放入 url 進行搜尋。
        $url = 'https://api.learningchocolate.com/resource?word='.$vocabulary.'&language=en';
        
        $information = file_get_contents($url);
        
        $pdo = null;
        
        echo $information;
        
    }




?>