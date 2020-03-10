<?php
    session_start();
    include('connMysql.php');

    
    $information = array();                     // 最後回傳的資訊陣列。
    date_default_timezone_set('Asia/Taipei');   //亞洲時區。


    $code = $_POST['code'];                      // 執行代碼。
    $account = $_SESSION['user'];                // 使用者帳號。
    $vocabulary = $_POST['target'];              // 對象(單字)。
    $theme_code = $_POST['theme_code'];          // 主題代碼。
    $title_code = $_POST['title_code'];          // 標題代碼。
    $practice_code = $_POST['practice_code'];    // 自主練習代碼。
    $datetime = $_POST['date_time'];             // 時間。

    

    if($code == 0){           //將點擊語音的紀錄插入資料庫。
        
        $cs_click_step = $_POST['click_step'];
        $cs_click_time = $_POST['click_time'];
        
        $sql = "
        INSERT INTO 
        vocabularyisland.exp_click_sound 
        (cs_account,cs_vocabulary,cs_theme,cs_title,cs_practice,cs_click_step,cs_click_time,cs_save_date) 
        VALUES
        (:cs_account,:cs_vocabulary,:cs_theme,:cs_title,:cs_practice,:cs_click_step,:cs_click_time,:cs_save_date)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':cs_account',$account);
        $stmt->bindValue(':cs_vocabulary',$vocabulary);
        $stmt->bindValue(':cs_theme',$theme_code);
        $stmt->bindValue(':cs_title',$title_code);
        $stmt->bindValue(':cs_practice',$practice_code);
        $stmt->bindValue(':cs_click_step',$cs_click_step);
        $stmt->bindValue(':cs_click_time',$cs_click_time);
        $stmt->bindValue(':cs_save_date',$datetime);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['exp_click_sound'] = 'Success';
        } else {
            $information['exp_click_sound'] = $stmt->error;
        }
        
        
        
    }elseif($code == 1){      //將錄音選擇的紀錄插入資料庫內。
        
        $select_target = $_POST['select_target'];
        
        $sql = "
        INSERT INTO 
        vocabularyisland.exp_select_record 
        (sr_account,sr_vocabulary,sr_theme,sr_title,sr_practice,sr_select_target,sr_save_date) 
        VALUES
        (:sr_account,:sr_vocabulary,:sr_theme,:sr_title,:sr_practice,:sr_select_target,:sr_save_date)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':sr_account',$account);
        $stmt->bindValue(':sr_vocabulary',$vocabulary);
        $stmt->bindValue(':sr_theme',$theme_code);
        $stmt->bindValue(':sr_title',$title_code);
        $stmt->bindValue(':sr_practice',$practice_code);
        $stmt->bindValue(':sr_select_target',$select_target);
        $stmt->bindValue(':sr_save_date',$datetime);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['exp_select_record'] = 'Success';
        } else {
            $information['exp_select_record'] = $stmt->error;
        }

        
        
    }elseif($code == 2){      //將刪除語音的紀錄插入資料庫內。
        
        $delete_time = $_POST['delete_time'];
        
        $sql = "
        INSERT INTO 
        vocabularyisland.exp_delete_record 
        (dr_account,dr_vocabulary,dr_theme,dr_title,dr_practice,dr_delete_time,dr_save_date) 
        VALUES
        (:dr_account,:dr_vocabulary,:dr_theme,:dr_title,:dr_practice,:dr_delete_time,:dr_save_date)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':dr_account',$account);
        $stmt->bindValue(':dr_vocabulary',$vocabulary);
        $stmt->bindValue(':dr_theme',$theme_code);
        $stmt->bindValue(':dr_title',$title_code);
        $stmt->bindValue(':dr_practice',$practice_code);
        $stmt->bindValue(':dr_delete_time',$delete_time);
        $stmt->bindValue(':dr_save_date',$datetime);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['exp_delete_record'] = 'Success';
        } else {
            $information['exp_delete_record'] = $stmt->error;
        }
        
        
    }elseif($code == 3){      //將點擊提示的紀錄插入資料庫。
        
        $ct_click_step = $_POST['click_step'];
        $ct_click_time = $_POST['tip_num'];
        
        $sql = "
        INSERT INTO 
        vocabularyisland.exp_click_tip 
        (ct_account,ct_vocabulary,ct_theme,ct_title,ct_practice,ct_click_step,ct_click_time,ct_save_date) 
        VALUES
        (:ct_account,:ct_vocabulary,:ct_theme,:ct_title,:ct_practice,:ct_click_step,:ct_click_time,:ct_save_date)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':ct_account',$account);
        $stmt->bindValue(':ct_vocabulary',$vocabulary);
        $stmt->bindValue(':ct_theme',$theme_code);
        $stmt->bindValue(':ct_title',$title_code);
        $stmt->bindValue(':ct_practice',$practice_code);
        $stmt->bindValue(':ct_click_step',$ct_click_step);
        $stmt->bindValue(':ct_click_time',$ct_click_time);
        $stmt->bindValue(':ct_save_date',$datetime);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['exp_click_tip'] = 'Success';
        } else {
            $information['exp_click_tip'] = $stmt->error;
        }
        
        
    }elseif($code == 4){      //將錄製的語音紀錄插入資料庫內。
        
        /* 將檔案放入資料夾中 */
        $audio = $_POST['audURI'];
        $GetOnly =  md5(uniqid(rand()));
        $audio = str_replace('data:audio/wav;base64,', '', $audio); 
        $audio = str_replace(' ', '+', $audio); 
        $audio_data = base64_decode($audio);                        //將base64解碼成圖檔資料。
        $audio_path = '../upload/sound/'.$GetOnly.'.wav';
        file_put_contents($audio_path,$audio_data);
        
        $sql = "
        INSERT INTO 
        vocabularyisland.record 
        (au_account,au_filename,au_vocabulary,au_theme,au_title,au_practice,au_save_date) 
        VALUES
        (:au_account,:au_filename,:au_vocabulary,:au_theme,:au_title,:au_practice,:au_save_date)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':au_account',$account);
        $stmt->bindValue(':au_filename',$GetOnly);
        $stmt->bindValue(':au_vocabulary',$vocabulary);
        $stmt->bindValue(':au_theme',$theme_code);
        $stmt->bindValue(':au_title',$title_code);
        $stmt->bindValue(':au_practice',$practice_code);
        $stmt->bindValue(':au_save_date',$datetime);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['record'] = 'Success';
        } else {
            $information['record'] = $stmt->error;
        }
        
        
    }elseif($code == 5){      //將點擊提示的紀錄插入資料庫。
        
        $wt_step = $_POST['wrong_step'];
        $wt_wrong_time = $_POST['wrong_time'];
        
        $sql = "
        INSERT INTO 
        vocabularyisland.exp_wrong_time 
        (wt_account,wt_vocabulary,wt_theme,wt_title,wt_practice,wt_step,wt_wrong_time,wt_save_date) 
        VALUES
        (:wt_account,:wt_vocabulary,:wt_theme,:wt_title,:wt_practice,:wt_step,:wt_wrong_time,:wt_save_date)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':wt_account',$account);
        $stmt->bindValue(':wt_vocabulary',$vocabulary);
        $stmt->bindValue(':wt_theme',$theme_code);
        $stmt->bindValue(':wt_title',$title_code);
        $stmt->bindValue(':wt_practice',$practice_code);
        $stmt->bindValue(':wt_step',$wt_step);
        $stmt->bindValue(':wt_wrong_time',$wt_wrong_time);
        $stmt->bindValue(':wt_save_date',$datetime);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['exp_wrong_time'] = 'Success';
        } else {
            $information['exp_wrong_time'] = $stmt->error;
        }
        
        
    }else{                    //將完成基礎練習的紀錄插入資料庫內。
        
        $sql = "
        INSERT INTO
        vocabularyisland.practice_status 
        (ps_account,ps_theme,ps_title,ps_practice,ps_save_date) 
        VALUES
        (:ps_account,:ps_theme,:ps_title,:ps_practice,:ps_save_date)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':ps_account',$account);
        $stmt->bindValue(':ps_theme',$theme_code);
        $stmt->bindValue(':ps_title',$title_code);
        $stmt->bindValue(':ps_practice',$practice_code);
        $stmt->bindValue(':ps_save_date',$datetime);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['practice_status'] = 'Success';
        } else {
            $information['practice_status'] = $stmt->error;
        }
        
    }
    
    $pdo = null;
    echo json_encode($information);

?>