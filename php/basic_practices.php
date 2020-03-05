<?php
    session_start();
    include('connMysql.php');
    
    $information = array();                 // 最後回傳的資訊陣列。

    $code = $_GET['code'];                  // 執行代碼。
    $vocabulary = $_GET['target'];          // 對象(單字)。
    $theme_code = $_GET['theme_code'];      // 主題代碼。
    $title_code = $_GET['title_code'];      // 標題代碼。
    $practice_code = $_GET['practice_code'];// 自主練習代碼。
    $account = $_SESSION['user'];           // 使用者帳號。
    $date = ;
    

    if($code == 0){           //將點擊語音的紀錄插入資料庫。
        
        $sql = "
        INSERT INTO 
        vocabularyisland.exp_click_sound 
        (cs_account,cs_vocabulary,cs_theme,cs_title,cs_practice,cs_click_code,cs_save_date) 
        VALUES
        (:cs_account,:cs_vocabulary,:cs_theme,:cs_title,:cs_practice,:cs_click_code,:cs_save_date)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':cs_account',$account);
        $stmt->bindValue(':cs_vocabulary',$vocabulary);
        $stmt->bindValue(':cs_theme',$theme_code);
        $stmt->bindValue(':cs_title',$title_code);
        $stmt->bindValue(':cs_practice',$practice_code);
        $stmt->bindValue(':cs_click_code',$cs_click_code);
        $stmt->bindValue(':cs_save_date',$i);
        $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。"); //執行。 
        $pdo = null;
        
        echo $information;
        
    }elseif($code == 1){      //將錄音選擇的紀錄插入資料庫內。
        
        
    }elseif($code == 2){      //將刪除語音的紀錄插入資料庫內。
        
        
    }elseif($code == 3){      //將點擊提示的紀錄插入資料庫。
        
        
    }elseif($code == 4){      //將錄製的語音紀錄插入資料庫內。

        
    }else{                    //將完成基礎練習的紀錄插入資料庫內。
        
        
    }
?>