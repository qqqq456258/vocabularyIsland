<?php
    session_start();
    include('connMysql.php');

    $id = $_POST['account'];
    $pw = $_POST['password'];

    // 	搜尋資料庫資料
    $sql = "SELECT * FROM vocabularyisland.member WHERE user_account = :ID";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':ID',$id); // 避免SQL injection。以 :UserID 代替並放入語法內。
    $stmt->execute() or exit("讀取member資料表時，發生錯誤。"); //執行pdo物件；反之出錯。 
    $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一取出，並以陣列放入$row。
    $nRows = Count($row);  // 資料幾筆，預設：只取出一筆，所以基本上會輸出 1 。

    if($id == null || $pw == null){//無輸入的情況。

        $pdo = null;
        echo json_encode(array(
                    'status' => "no input"
                ));
    }elseif( $nRows == 0 ){  //無此帳號的情況。

        $pdo = null;
        echo json_encode(array(
                    'status' => "no data"
                ));
    }elseif( $row[0]['user_account'] == $id && $row[0]['user_pwd'] == $pw ){

        /* 將個人資訊放入SESSION方便以後使用。 */
        $_SESSION["user"] = $id;
        $_SESSION["psw"] = $pw;

        /* 抓取姓名 */
//        $sql = "SELECT pi_name FROM vocabularyisland.personal_information WHERE pi_account = :ID";
//        $stmt = $pdo->prepare($sql);
//        $stmt->bindValue(':ID',$id); // 避免SQL injection。以 :ID 代替並放入語法內。
//        $stmt->execute() or exit("讀取member資料表時，發生錯誤。"); //執行pdo物件；反之出錯。 
//        $row = $stmt->fetchALL(PDO::FETCH_ASSOC); // 將帳號資料照索引順序一一取出，並以陣列放入$row。
        $name = $row[0]['user_name'];
        

        $pdo = null;
        echo json_encode(array(
                    'nickname' => $name,
                    'status' => "success"
                ));
    }else{//擋掉無帳號且非完整輸入的以後，就只剩下密碼錯誤的情況。

        $pdo = null;
        echo json_encode(array(
                    'status' => "error password"
                ));
    }

?>