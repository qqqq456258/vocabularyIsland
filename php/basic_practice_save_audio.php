<?php 
    start_session(7200);        //設定session 時間為 7200秒 = 2小時。
    date_default_timezone_set("Asia/Taipei");   //設定時區 
    include("connMysql0917.php");

    /* 宣告部分 */
//    $image = $_POST['imgURI'];  // 圖檔base64資料。
    $audio = $_POST['audURI'];  // 音檔base64資料。
    $author = $_SESSION['user'];    //作者。
    $vocabulary_en = $_POST["vocabulary_en"];   //英文單字。
    $vocabulary_ch = $_POST["vocabulary_ch"];   //單字翻譯。
    $vocabulary_partOfSpeech = $_POST["vocabulary_partOfSpeech"]; //單字詞性。
    $association_data_string = $_POST["association_data_string"];   //聯想詞的字串，例如：{a:a;v:v;b:b;}，共三組。
    $association_num = $_POST["association_num"];   //聯想詞組數。
    $sentence_context = $_POST["sentence_context"];  //造句句子上下文。
    $date = date("Y-m-d");  //日期
    $spilt_string_group = explode(';', $association_data_string);    // 切割string，然後放入陣列中。


//    /* 解碼 base64 圖檔資料*/
//    $img = str_replace('data:image/png;base64,', '', $image);
//    $img = str_replace(' ', '+', $img);
//    $data = base64_decode($img);    //將base64解碼成圖檔資料。
//    /* 給予檔案身分證(唯一)。 */
//    $GetOnly =  md5(uniqid(rand()));    //
//    $filename = "_".$author."_".$vocabulary_en.'_'.$date.'_'.$GetOnly;
//    /* 生成圖檔並存入資料夾 */
//    $Path = "image/".$filename.'.png';
//    file_put_contents($Path, $data); // file_put_contents()，放入一個必填、一個可選參數：路徑、文件數據(如base64)。
    
    /* 解碼 base64 音檔資料*/
    $aud = str_replace('data:audio/wav;base64,', '', $audio);
    $aud = str_replace(' ', '+', $aud); 
    $data = base64_decode($aud);    //將base64解碼成音檔資料。
    /* 生成音檔並存入資料夾 */
    $Path = 'ownVoice/'.$filename.'.wav';
    file_put_contents($Path,$data);
        
    /* 資料庫內動作：存入 card 資料表。  */
    $sql_saveData = "INSERT INTO dev1.card(author,filename,voice_name,english_vocabulary,translation_vocabulary,part_of_speech,save_date,collected_time,total_painting_score,total_speaking_score,total_guess_time) VALUES(:author,:filename,:voice_name,:english_vocabulary,:translation_vocabulary,:part_of_speech,:save_date,:collected_time,:total_painting_score,:total_speaking_score,:total_guess_time)";
    $stmt = $pdo->prepare($sql_saveData);
    $stmt->bindValue(':author',$author);
    $stmt->bindValue(':filename',$filename);
    $stmt->bindValue(':voice_name',$filename);
    $stmt->bindValue(':english_vocabulary',$vocabulary_en);
    $stmt->bindValue(':translation_vocabulary',$vocabulary_ch);
    $stmt->bindValue(':part_of_speech',$vocabulary_partOfSpeech);
    $stmt->bindValue(':save_date',$date);
    $stmt->bindValue(':collected_time',$zero);
    $stmt->bindValue(':total_painting_score',$zero);
    $stmt->bindValue(':total_speaking_score',$zero);
    $stmt->bindValue(':total_guess_time',$zero);
    if (!$stmt->execute()) { 
        print_r($stmt->errorInfo());
    }

    /* 資料庫內動作：存入 sentence_library 資料表。  */
    $sql_insertSentence = "INSERT INTO dev1.sentence_library(SL_filename,SL_author,sentence,save_date) VALUES(:SL_filename,:SL_author,:sentence,:save_date)";
    $stmt = $pdo->prepare($sql_insertSentence);
    $stmt->bindValue(':SL_filename',$filename);
    $stmt->bindValue(':SL_author',$author);
    $stmt->bindValue(':sentence',$sentence_context);
    $stmt->bindValue(':save_date',$date);
    if (!$stmt->execute()) { 
        print_r($stmt->errorInfo());
    }

    /* 資料庫內動作：更新 personal_information 資料表中 字卡數目+1。  */
    $sql_updateData = "UPDATE dev1.personal_information SET total_card_amount=total_card_amount+1 WHERE pi_account=:pi_account";
    $stmt = $pdo->prepare($sql_updateData);
    $stmt->bindValue(':pi_account',$author);
    if (!$stmt->execute()) {
        print_r($stmt->errorInfo());
    }

    /* 資料庫內動作：存入 associative_library 資料表。  */
    $sql_insertAssociation = "INSERT INTO dev1.associative_library(AW_filename,AW_author,english_vocabulary,Associative_word_en,Associative_word_ch,save_date) VALUES(:AW_filename,:AW_author,:english_vocabulary,:Associative_word_en,:Associative_word_ch,:save_date)";
    for($i=0;$i<$association_num;$i++){
        $spilt_string = explode(':',$spilt_string_group[$i]);   //將中英文分割。
        $stmt = $pdo->prepare($sql_insertAssociation);
        $stmt->bindValue(':AW_filename',$filename);
        $stmt->bindValue(':AW_author',$author);
        $stmt->bindValue(':english_vocabulary',$vocabulary_en);
        $stmt->bindValue(':Associative_word_en',$spilt_string[0]);
        $stmt->bindValue(':Associative_word_ch',$spilt_string[1]);
        $stmt->bindValue(':save_date',$date);
        if (!$stmt->execute()) { 
            print_r($stmt->errorInfo());
        }
    }

    $pdo = null;
?>