<?php

    include('../php/connMysql.php');
    $fp = fopen("GG.csv", "r");
    while (($data = fgetcsv($fp, 1000, ",")) !== FALSE) {
        $vl_vocabulary = $data[0];
        $vl_definition = $data[1];
        $vl_part_of_speech = $data[2];
        $vl_theme = $data[3];
        $vl_title = $data[4];
        $vl_practice = $data[5];
        $vl_upload_date = $data[6];

        $vl_definition = iconv("BIG5", "UTF-8", $vl_definition);

        echo $vl_definition;

        $sql = "INSERT INTO vocabularyisland.vocabulary_library
    (vl_vocabulary,vl_definition,vl_part_of_speech,vl_theme,vl_title,vl_practice,vl_upload_date)
    VALUES (:vl_vocabulary,:vl_definition,:vl_part_of_speech,:vl_theme,:vl_title,:vl_practice,:vl_upload_date)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':vl_vocabulary',$vl_vocabulary);
            $stmt->bindValue(':vl_definition',$vl_definition);
            $stmt->bindValue(':vl_part_of_speech',$vl_part_of_speech);
            $stmt->bindValue(':vl_theme',$vl_theme);
            $stmt->bindValue(':vl_title',$vl_title);
            $stmt->bindValue(':vl_practice',$vl_practice);
            $stmt->bindValue(':vl_upload_date',$vl_upload_date);
            $stmt->execute();
    }

?>