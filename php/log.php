<?php

    try{
        $dsn = "mysql:host=localhost;port=3306;dbname=vocabularyisland;charset=utf8";

         $user = "root";	// mysql使用者名稱
         $password = "";	// mysql使用者密碼


//       $user = "vi";	// mysql使用者名稱
//       $password = "GDfGy6$nzfB@";	// mysql使用者密碼

        $options = array (PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);
        /*
             ATTR_EERMODE：是個要用PDO時的一定要的基本設定。
             ERRMODE_EXCEPTION. 它會自動告訴PDO每次查詢失敗時拋出異常。
        */
        $pdo = new PDO($dsn,$user,$password,$options);
        $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION); //錯誤訊息提醒
        $pdo->query("SET NAMES 'utf8'");  // 以UTF8編碼，SQL語法使用於資料庫。
    }catch(PDOException $e){	
        echo "資料庫連線失敗！錯誤訊息：",$e->getMessage();	
        exit;
    }

    $information = array();
/*
    練習發音時，聆聽語音次數
    練習發音時，重新發音次數
    練習發音時，挑選發音紀錄
    第一次拼字，聆聽語音次數
    第一次拼字，提示次數
    第二次拼字，聆聽語音次數
    第二次拼字，提示次數
*/

/** 抓取 【練習發音時，聆聽語音次數】**/
for($i = 0 ; $i < 16 ; $i++){ 
    
    /* 抓某人的全部時間 */
    $sql = "SELECT distinct cs_save_date From vocabularyisland.exp_click_sound
    WHERE cs_account = :cs_account
    AND cs_theme = :cs_theme
    AND cs_title = :cs_title
    AND cs_practice = :cs_practice
    AND cs_click_step = :cs_click_step
    order by cs_save_date ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':cs_account',$_GET['account']);
    $stmt->bindValue(':cs_theme',0);
    $stmt->bindValue(':cs_title',0);
    $stmt->bindValue(':cs_practice',floor($i/2));
    $stmt->bindValue(':cs_click_step',0);
    $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
    $Rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $amount = count($Rows);

    //echo "時間總筆數：".$amount."\n";
if($amount>0){
    
    /* 確定每個時間是否為完整四筆 */
    $control = 0;
    for($k = 0 ; $k < $amount ; $k++ ){

    //echo "第".$k."時間資料：".$Rows[$k]['cs_save_date']."\n";

        $sql = "SELECT count(cs_click_time) as num From vocabularyisland.exp_click_sound
                WHERE cs_account = :cs_account
                AND cs_theme = :cs_theme
                AND cs_title = :cs_title
                AND cs_practice = :cs_practice
                AND cs_click_step = :cs_click_step
                AND cs_save_date = :cs_save_date";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':cs_account',$_GET['account']);
        $stmt->bindValue(':cs_theme',0);
        $stmt->bindValue(':cs_title',0);
        $stmt->bindValue(':cs_practice',floor($i/2));
        $stmt->bindValue(':cs_click_step',0);
        $stmt->bindValue(':cs_save_date',$Rows[$k]['cs_save_date']);
        $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
        $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $check = $rows[0]['num'];

    //echo "第".$k."時間資料確定筆數：".$check."\n";

        if($check == 4){    // 正確，抓出總和放入 information array。
            $sql = "SELECT SUM(cs_click_time) as total From vocabularyisland.exp_click_sound
                    WHERE cs_account = :cs_account
                    AND cs_theme = :cs_theme
                    AND cs_title = :cs_title
                    AND cs_practice = :cs_practice
                    AND cs_click_step = :cs_click_step
                    AND cs_save_date = :cs_save_date";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':cs_account',$_GET['account']);
            $stmt->bindValue(':cs_theme',0);
            $stmt->bindValue(':cs_title',0);
            $stmt->bindValue(':cs_practice',floor($i/2));
            $stmt->bindValue(':cs_click_step',0);
            $stmt->bindValue(':cs_save_date',$Rows[$k]['cs_save_date']);
            $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
            $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
            $information[0][$i] = $rows[0]['total'];
            if($control == 0){
                $control++;
                $i++;
            }else{
                break;
            }

        }else{
            // 錯誤，直接忽略
        }
    }
    
}else{
    $information[0][$i] = "undefined";
}
}

/** 抓取 【練習發音時，重新發音次數】**/
for($i = 0 ; $i < 16 ; $i++){ 
    
    /* 抓某人的全部時間 */
    $sql = "SELECT distinct dr_save_date From vocabularyisland.exp_delete_record
    WHERE dr_account = :dr_account
    AND dr_theme = :dr_theme
    AND dr_title = :dr_title
    AND dr_practice = :dr_practice
    order by dr_save_date ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':dr_account',$_GET['account']);
    $stmt->bindValue(':dr_theme',0);
    $stmt->bindValue(':dr_title',0);
    $stmt->bindValue(':dr_practice',floor($i/2));
    $stmt->execute() or exit("讀取 exp_delete_record 資料表時，發生錯誤。");
    $Rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $amount = count($Rows);

    //echo "時間總筆數：".$amount."\n";
if($amount>0){
    /* 確定每個時間是否為完整四筆 */
    $control = 0;
    for($k = 0 ; $k < $amount ; $k++ ){

    //echo "第".$k."時間資料：".$Rows[$k]['cs_save_date']."\n";

        $sql = "SELECT count(*) as num From vocabularyisland.exp_delete_record
                WHERE dr_account = :dr_account
                AND dr_theme = :dr_theme
                AND dr_title = :dr_title
                AND dr_practice = :dr_practice
                AND dr_save_date = :dr_save_date";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':dr_account',$_GET['account']);
        $stmt->bindValue(':dr_theme',0);
        $stmt->bindValue(':dr_title',0);
        $stmt->bindValue(':dr_practice',floor($i/2));
        $stmt->bindValue(':dr_save_date',$Rows[$k]['dr_save_date']);
        $stmt->execute() or exit("讀取 exp_delete_record 資料表時，發生錯誤。");
        $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $check = $rows[0]['num'];

    //echo "第".$k."時間資料確定筆數：".$check."\n";

        if($check == 4){    // 正確，抓出總和放入 information array。
            $sql = "SELECT SUM(dr_delete_time) as total From vocabularyisland.exp_delete_record
                    WHERE dr_account = :dr_account
                    AND dr_theme = :dr_theme
                    AND dr_title = :dr_title
                    AND dr_practice = :dr_practice
                    AND dr_save_date = :dr_save_date";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':dr_account',$_GET['account']);
            $stmt->bindValue(':dr_theme',0);
            $stmt->bindValue(':dr_title',0);
            $stmt->bindValue(':dr_practice',floor($i/2));
            $stmt->bindValue(':dr_save_date',$Rows[$k]['dr_save_date']);
            $stmt->execute() or exit("讀取 exp_delete_record 資料表時，發生錯誤。");
            $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
            $information[1][$i] = $rows[0]['total'];
            if($control == 0){
                $control++;
                $i++;
            }else{
                break;
            }
        }else{
            // 錯誤，直接忽略
        }
    }
    
}else{
    $information[1][$i] = "undefined";
}
    
}

/** 抓取 【練習發音時，挑選發音紀錄】**/
for($i = 0 ; $i < 16 ; $i++){ 
    
    /* 抓某人的全部時間 */
    $sql = "SELECT distinct sr_save_date From vocabularyisland.exp_select_record
    WHERE sr_account = :sr_account
    AND sr_theme = :sr_theme
    AND sr_title = :sr_title
    AND sr_practice = :sr_practice
    order by sr_save_date ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':sr_account',$_GET['account']);
    $stmt->bindValue(':sr_theme',0);
    $stmt->bindValue(':sr_title',0);
    $stmt->bindValue(':sr_practice',floor($i/2));
    $stmt->execute() or exit("讀取 exp_select_record 資料表時，發生錯誤。");
    $Rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $amount = count($Rows);

//    echo "時間總筆數：".$amount."\n";
if($amount > 0){
    /* 確定每個時間是否為完整四筆 */
    $control = 0;
    for($k = 0 ; $k < $amount ; $k++ ){

//    echo "第".$k."時間資料：".$Rows[$k]['sr_save_date']."\n";

        $sql = "SELECT count(*) as num From vocabularyisland.exp_select_record
                WHERE sr_account = :sr_account
                AND sr_theme = :sr_theme
                AND sr_title = :sr_title
                AND sr_practice = :sr_practice
                AND sr_save_date = :sr_save_date";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':sr_account',$_GET['account']);
        $stmt->bindValue(':sr_theme',0);
        $stmt->bindValue(':sr_title',0);
        $stmt->bindValue(':sr_practice',floor($i/2));
        $stmt->bindValue(':sr_save_date',$Rows[$k]['sr_save_date']);
        $stmt->execute() or exit("讀取 exp_select_record 資料表時，發生錯誤。");
        $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $check = $rows[0]['num'];

//    echo "第".$k."時間資料確定筆數：".$check."\n";

        if($check == 4){    // 正確，抓出總和放入 information array。
            $select_first_amount = 0;
            $select_second_amount = 0;
            
            $sql = "SELECT count(sr_select_target) as total_select_first From vocabularyisland.exp_select_record
                    WHERE sr_account = :sr_account
                    AND sr_theme = :sr_theme
                    AND sr_title = :sr_title
                    AND sr_practice = :sr_practice
                    AND sr_select_target = :sr_select_target
                    AND sr_save_date = :sr_save_date";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':sr_account',$_GET['account']);
            $stmt->bindValue(':sr_theme',0);
            $stmt->bindValue(':sr_title',0);
            $stmt->bindValue(':sr_practice',floor($i/2));
            $stmt->bindValue(':sr_select_target',1);
            $stmt->bindValue(':sr_save_date',$Rows[$k]['sr_save_date']);
            $stmt->execute() or exit("讀取 exp_select_record 資料表時，發生錯誤。");
            $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
            $select_first_amount = $rows[0]['total_select_first'];
            
            $sql = "SELECT count(sr_select_target) as total_select_second From vocabularyisland.exp_select_record
                    WHERE sr_account = :sr_account
                    AND sr_theme = :sr_theme
                    AND sr_title = :sr_title
                    AND sr_practice = :sr_practice
                    AND sr_select_target = :sr_select_target
                    AND sr_save_date = :sr_save_date";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':sr_account',$_GET['account']);
            $stmt->bindValue(':sr_theme',0);
            $stmt->bindValue(':sr_title',0);
            $stmt->bindValue(':sr_practice',floor($i/2));
            $stmt->bindValue(':sr_select_target',2);
            $stmt->bindValue(':sr_save_date',$Rows[$k]['sr_save_date']);
            $stmt->execute() or exit("讀取 exp_select_record 資料表時，發生錯誤。");
            $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
            $select_second_amount = $rows[0]['total_select_second'];
            
            
            $information[2][$i] = $select_first_amount." | ".$select_second_amount;
            if($control == 0){
                $control++;
                $i++;
            }else{
                break;
            }
        }else{
            // 錯誤，直接忽略
        }
    }

}else{
    $information[2][$i] = 'undefined';
}
    
}

/** 抓取 【第一次拼字，聆聽語音次數】**/
for($i = 0 ; $i < 16 ; $i++){ 
    
    /* 抓某人的全部時間 */
    $sql = "SELECT distinct cs_save_date From vocabularyisland.exp_click_sound
    WHERE cs_account = :cs_account
    AND cs_theme = :cs_theme
    AND cs_title = :cs_title
    AND cs_practice = :cs_practice
    AND cs_click_step = :cs_click_step
    order by cs_save_date ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':cs_account',$_GET['account']);
    $stmt->bindValue(':cs_theme',0);
    $stmt->bindValue(':cs_title',0);
    $stmt->bindValue(':cs_practice',floor($i/2));
    $stmt->bindValue(':cs_click_step',1);
    $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
    $Rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $amount = count($Rows);

    //echo "時間總筆數：".$amount."\n";
if($amount > 0){
    /* 確定每個時間是否為完整四筆 */
    $control = 0;
    for($k = 0 ; $k < $amount ; $k++ ){

    //echo "第".$k."時間資料：".$Rows[$k]['cs_save_date']."\n";

        $sql = "SELECT count(cs_click_time) as num From vocabularyisland.exp_click_sound
                WHERE cs_account = :cs_account
                AND cs_theme = :cs_theme
                AND cs_title = :cs_title
                AND cs_practice = :cs_practice
                AND cs_click_step = :cs_click_step
                AND cs_save_date = :cs_save_date";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':cs_account',$_GET['account']);
        $stmt->bindValue(':cs_theme',0);
        $stmt->bindValue(':cs_title',0);
        $stmt->bindValue(':cs_practice',floor($i/2));
        $stmt->bindValue(':cs_click_step',1);
        $stmt->bindValue(':cs_save_date',$Rows[$k]['cs_save_date']);
        $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
        $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $check = $rows[0]['num'];

    //echo "第".$k."時間資料確定筆數：".$check."\n";

        if($check == 4){    // 正確，抓出總和放入 information array。
            $sql = "SELECT SUM(cs_click_time) as total From vocabularyisland.exp_click_sound
                    WHERE cs_account = :cs_account
                    AND cs_theme = :cs_theme
                    AND cs_title = :cs_title
                    AND cs_practice = :cs_practice
                    AND cs_click_step = :cs_click_step
                    AND cs_save_date = :cs_save_date";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':cs_account',$_GET['account']);
            $stmt->bindValue(':cs_theme',0);
            $stmt->bindValue(':cs_title',0);
            $stmt->bindValue(':cs_practice',floor($i/2));
            $stmt->bindValue(':cs_click_step',1);
            $stmt->bindValue(':cs_save_date',$Rows[$k]['cs_save_date']);
            $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
            $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
            $information[3][$i] = $rows[0]['total'];
            if($control == 0){
                $control++;
                $i++;
            }else{
                break;
            }

        }else{
            // 錯誤，直接忽略
        }
    }

}else{
    $information[3][$i] = 'undefined';
}
    
}

/** 抓取 【第一次拼字，提示次數】**/
for($i = 0 ; $i < 16 ; $i++){ 
    
    /* 抓某人的全部時間 */
    $sql = "SELECT distinct ct_save_date From vocabularyisland.exp_click_tip
    WHERE ct_account = :ct_account
    AND ct_theme = :ct_theme
    AND ct_title = :ct_title
    AND ct_practice = :ct_practice
    AND ct_click_step = :ct_click_step
    order by ct_save_date ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':ct_account',$_GET['account']);
    $stmt->bindValue(':ct_theme',0);
    $stmt->bindValue(':ct_title',0);
    $stmt->bindValue(':ct_practice',floor($i/2));
    $stmt->bindValue(':ct_click_step',0);
    $stmt->execute() or exit("讀取 exp_click_tip 資料表時，發生錯誤。");
    $Rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $amount = count($Rows);

    //echo "時間總筆數：".$amount."\n";
if($amount>0){
    /* 確定每個時間是否為完整四筆 */
    $control = 0;
    for($k = 0 ; $k < $amount ; $k++ ){

    //echo "第".$k."時間資料：".$Rows[$k]['ct_save_date']."\n";

        $sql = "SELECT count(ct_click_time) as num From vocabularyisland.exp_click_tip
                WHERE ct_account = :ct_account
                AND ct_theme = :ct_theme
                AND ct_title = :ct_title
                AND ct_practice = :ct_practice
                AND ct_click_step = :ct_click_step
                AND ct_save_date = :ct_save_date";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':ct_account',$_GET['account']);
        $stmt->bindValue(':ct_theme',0);
        $stmt->bindValue(':ct_title',0);
        $stmt->bindValue(':ct_practice',floor($i/2));
        $stmt->bindValue(':ct_click_step',0);
        $stmt->bindValue(':ct_save_date',$Rows[$k]['ct_save_date']);
        $stmt->execute() or exit("讀取 exp_click_tip 資料表時，發生錯誤。");
        $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $check = $rows[0]['num'];

    //echo "第".$k."時間資料確定筆數：".$check."\n";

        if($check == 4){    // 正確，抓出總和放入 information array。
            $sql = "SELECT SUM(ct_click_time) as total From vocabularyisland.exp_click_tip
                    WHERE ct_account = :ct_account
                    AND ct_theme = :ct_theme
                    AND ct_title = :ct_title
                    AND ct_practice = :ct_practice
                    AND ct_click_step = :ct_click_step
                    AND ct_save_date = :ct_save_date";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':ct_account',$_GET['account']);
            $stmt->bindValue(':ct_theme',0);
            $stmt->bindValue(':ct_title',0);
            $stmt->bindValue(':ct_practice',floor($i/2));
            $stmt->bindValue(':ct_click_step',0);
            $stmt->bindValue(':ct_save_date',$Rows[$k]['ct_save_date']);
            $stmt->execute() or exit("讀取 exp_click_tip 資料表時，發生錯誤。");
            $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
            $information[4][$i] = $rows[0]['total'];
            if($control == 0){
                $control++;
                $i++;
            }else{
                break;
            }

        }else{
            // 錯誤，直接忽略
        }
    }

}else{
    $information[4][$i] = 'undefined';
}
    
}

/** 抓取 【第二次拼字，聆聽語音次數】**/
for($i = 0 ; $i < 16 ; $i++){ 
    
    /* 抓某人的全部時間 */
    $sql = "SELECT distinct cs_save_date From vocabularyisland.exp_click_sound
    WHERE cs_account = :cs_account
    AND cs_theme = :cs_theme
    AND cs_title = :cs_title
    AND cs_practice = :cs_practice
    AND cs_click_step = :cs_click_step
    order by cs_save_date ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':cs_account',$_GET['account']);
    $stmt->bindValue(':cs_theme',0);
    $stmt->bindValue(':cs_title',0);
    $stmt->bindValue(':cs_practice',floor($i/2));
    $stmt->bindValue(':cs_click_step',2);
    $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
    $Rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $amount = count($Rows);

    //echo "時間總筆數：".$amount."\n";
if($amount > 0){
    /* 確定每個時間是否為完整四筆 */
    $control = 0;
    for($k = 0 ; $k < $amount ; $k++ ){

    //echo "第".$k."時間資料：".$Rows[$k]['cs_save_date']."\n";

        $sql = "SELECT count(cs_click_time) as num From vocabularyisland.exp_click_sound
                WHERE cs_account = :cs_account
                AND cs_theme = :cs_theme
                AND cs_title = :cs_title
                AND cs_practice = :cs_practice
                AND cs_click_step = :cs_click_step
                AND cs_save_date = :cs_save_date";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':cs_account',$_GET['account']);
        $stmt->bindValue(':cs_theme',0);
        $stmt->bindValue(':cs_title',0);
        $stmt->bindValue(':cs_practice',floor($i/2));
        $stmt->bindValue(':cs_click_step',2);
        $stmt->bindValue(':cs_save_date',$Rows[$k]['cs_save_date']);
        $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
        $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $check = $rows[0]['num'];

    //echo "第".$k."時間資料確定筆數：".$check."\n";

        if($check == 4){    // 正確，抓出總和放入 information array。
            $sql = "SELECT SUM(cs_click_time) as total From vocabularyisland.exp_click_sound
                    WHERE cs_account = :cs_account
                    AND cs_theme = :cs_theme
                    AND cs_title = :cs_title
                    AND cs_practice = :cs_practice
                    AND cs_click_step = :cs_click_step
                    AND cs_save_date = :cs_save_date";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':cs_account',$_GET['account']);
            $stmt->bindValue(':cs_theme',0);
            $stmt->bindValue(':cs_title',0);
            $stmt->bindValue(':cs_practice',floor($i/2));
            $stmt->bindValue(':cs_click_step',2);
            $stmt->bindValue(':cs_save_date',$Rows[$k]['cs_save_date']);
            $stmt->execute() or exit("讀取 exp_click_sound 資料表時，發生錯誤。");
            $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
            $information[5][$i] = $rows[0]['total'];
            if($control == 0){
                $control++;
                $i++;
            }else{
                break;
            }

        }else{
            // 錯誤，直接忽略
        }
    }

}else{
    $information[5][$i] = 'undefined';
}
    
}

/** 抓取 【第二次拼字，提示次數】**/
for($i = 0 ; $i < 16 ; $i++){ 
    
    /* 抓某人的全部時間 */
    $sql = "SELECT distinct ct_save_date From vocabularyisland.exp_click_tip
    WHERE ct_account = :ct_account
    AND ct_theme = :ct_theme
    AND ct_title = :ct_title
    AND ct_practice = :ct_practice
    AND ct_click_step = :ct_click_step
    order by ct_save_date ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':ct_account',$_GET['account']);
    $stmt->bindValue(':ct_theme',0);
    $stmt->bindValue(':ct_title',0);
    $stmt->bindValue(':ct_practice',floor($i/2));
    $stmt->bindValue(':ct_click_step',1);
    $stmt->execute() or exit("讀取 exp_click_tip 資料表時，發生錯誤。");
    $Rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $amount = count($Rows);

    //echo "時間總筆數：".$amount."\n";
if($amount>0){
    /* 確定每個時間是否為完整四筆 */
    $control = 0;
    for($k = 0 ; $k < $amount ; $k++ ){

    //echo "第".$k."時間資料：".$Rows[$k]['ct_save_date']."\n";

        $sql = "SELECT count(ct_click_time) as num From vocabularyisland.exp_click_tip
                WHERE ct_account = :ct_account
                AND ct_theme = :ct_theme
                AND ct_title = :ct_title
                AND ct_practice = :ct_practice
                AND ct_click_step = :ct_click_step
                AND ct_save_date = :ct_save_date";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':ct_account',$_GET['account']);
        $stmt->bindValue(':ct_theme',0);
        $stmt->bindValue(':ct_title',0);
        $stmt->bindValue(':ct_practice',floor($i/2));
        $stmt->bindValue(':ct_click_step',1);
        $stmt->bindValue(':ct_save_date',$Rows[$k]['ct_save_date']);
        $stmt->execute() or exit("讀取 exp_click_tip 資料表時，發生錯誤。");
        $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $check = $rows[0]['num'];

    //echo "第".$k."時間資料確定筆數：".$check."\n";

        if($check == 4){    // 正確，抓出總和放入 information array。
            $sql = "SELECT SUM(ct_click_time) as total From vocabularyisland.exp_click_tip
                    WHERE ct_account = :ct_account
                    AND ct_theme = :ct_theme
                    AND ct_title = :ct_title
                    AND ct_practice = :ct_practice
                    AND ct_click_step = :ct_click_step
                    AND ct_save_date = :ct_save_date";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':ct_account',$_GET['account']);
            $stmt->bindValue(':ct_theme',0);
            $stmt->bindValue(':ct_title',0);
            $stmt->bindValue(':ct_practice',floor($i/2));
            $stmt->bindValue(':ct_click_step',1);
            $stmt->bindValue(':ct_save_date',$Rows[$k]['ct_save_date']);
            $stmt->execute() or exit("讀取 exp_click_tip 資料表時，發生錯誤。");
            $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
            $information[6][$i] = $rows[0]['total'];
            if($control == 0){
                $control++;
                $i++;
            }else{
                break;
            }

        }else{
            // 錯誤，直接忽略
        }
    }

}else{
    $information[6][$i] = 'undefined';
}
    
}

/** 抓取姓名 **/
    $sql = "SELECT user_name FROM vocabularyisland.member
    WHERE user_account = :user_account";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_account',$_GET['account']);
    $stmt->execute() or exit("讀取 member 資料表時，發生錯誤。");
    $rows = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $information[7][0] = $rows[0]['user_name'];


    $pdo = null;

    echo json_encode($information);

?>