<?php
    session_start();
    include('connMysql.php');

    
    $information = array();                      // 最後回傳的資訊陣列。

    $code = $_POST['code'];                      // 執行代碼。
    $account = $_SESSION["user"];                // 使用者帳號。
    $theme_code = $_POST['theme_code'];          // 主題代碼。
    $title_code = $_POST['title_code'];          // 標題代碼。
    $practice_code = $_POST['practice_code'];    // 自主練習代碼。


    if($code == 0){         // 抓取自己先前的單字發音。
        $vocabulary = $_POST['vocabulary'];          // 單字。
        
        $sql = "SELECT au_filename,au_save_date FROM vocabularyisland.record WHERE au_account = :au_account AND au_vocabulary = :au_vocabulary AND au_theme = :au_theme AND au_title = :au_title AND au_practice = :au_practice ORDER BY au_save_date DESC LIMIT 1";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':au_account',$account);
        $stmt->bindValue(':au_vocabulary',$vocabulary);
        $stmt->bindValue(':au_theme',$theme_code);
        $stmt->bindValue(':au_title',$title_code);
        $stmt->bindValue(':au_practice',$practice_code);
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            
            $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將資料照索引順序一一全部取出，並以陣列放入。
            
            $information['record'] = array($row[0]['au_filename'],$row[0]['au_save_date']);
            
        } else {
            $information['record'] = $stmt->error;
        }
        
    }elseif($code == 1){   // 建立圖檔，並將資料插入。
        
        $vocabulary = $_POST['vocabulary'];          // 單字。
        $img_b64 = $_POST['base64'];
        $filename = $_POST['filename'];
        $datetime = $_POST['datetime'];
                    
        /* 將檔案放入資料夾中 */
        $img_b64 = str_replace('data:image/jpeg;base64,', '', $img_b64); 
        $img_b64 = str_replace(' ', '+', $img_b64); 
        $image_data = base64_decode($img_b64);      //將base64解碼成圖檔資料。
        $image_path = '../upload/image/'.$filename.'.jpeg';
        file_put_contents($image_path,$image_data);
        
        $sql = "
        INSERT INTO 
        vocabularyisland.picture 
        (img_account,img_filename,img_vocabulary,img_save_date,img_theme,img_title,img_practice) 
        VALUES
        (:img_account,:img_filename,:img_vocabulary,:img_save_date,:img_theme,:img_title,:img_practice)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':img_account',$account);
        $stmt->bindValue(':img_filename',$filename);
        $stmt->bindValue(':img_vocabulary',$vocabulary);
        $stmt->bindValue(':img_save_date',$datetime);
        $stmt->bindValue(':img_theme',$theme_code);
        $stmt->bindValue(':img_title',$title_code);
        $stmt->bindValue(':img_practice',$practice_code);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['picture'] = 'Success';
        } else {
            $information['picture'] = $stmt->error;
        }
        
        
        
        
    }elseif($code == 2){      //抓本單元的四個單字。
        
        $sql = "
        SELECT vocabulary_library.vl_vocabulary,vocabulary_library.vl_part_of_speech,vocabulary_library.vl_definition
        FROM vocabularyisland.vocabulary_library
        WHERE vocabulary_library.vl_theme = :vl_theme AND vocabulary_library.vl_title = :vl_title AND vocabulary_library.vl_practice = :vl_practice
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':vl_theme',$theme_code);
        $stmt->bindValue(':vl_title',$title_code);
        $stmt->bindValue(':vl_practice',$practice_code);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) {
            $information['get_vocbulary'] = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將資料照索引順序一一全部取出，並以陣列放入。
        } else {
            $information['get_vocbulary'] = $stmt->error;
        }
        
        
    }else{    //將字卡資訊插入資料庫。
        
        $vocabulary = $_POST['vocabulary'];          // 單字。
        $bg_color = $_POST['bg_color'];
        $br_color = $_POST['br_color'];
        $filename = $_POST['filename'];
        $datetime = $_POST['datetime'];
        
        
        $sql = "
        INSERT INTO 
        vocabularyisland.card 
        (author,picture_filename,voice_filename,vocabulary,background_color,border_color,save_date,theme,title,practice) 
        VALUES
        (:author,:picture_filename,:voice_filename,:vocabulary,:background_color,:border_color,:save_date,:theme,:title,:practice)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':author',$account);
        $stmt->bindValue(':picture_filename',$filename);
        $stmt->bindValue(':voice_filename',$filename);
        $stmt->bindValue(':vocabulary',$vocabulary);
        $stmt->bindValue(':background_color',$bg_color);
        $stmt->bindValue(':border_color',$br_color);
        $stmt->bindValue(':save_date',$datetime);
        $stmt->bindValue(':theme',$theme_code);
        $stmt->bindValue(':title',$title_code);
        $stmt->bindValue(':practice',$practice_code);
        
        /* 回傳狀態。*/
        if ($stmt->execute()) { 
            $information['card'] = 'Success';
        } else {
            $information['card'] = $stmt->error;
        }
    }


    $pdo = null;
    echo json_encode($information);
        
?>