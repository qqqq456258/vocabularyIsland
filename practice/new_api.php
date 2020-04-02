<?php
    $value = 'crab';            // 以 pig 為範例。
    $value = trim($value);      // 去除字尾空白
    $value = preg_replace('/\s/','%20', $value); //將字串內的空白從 ASCII Value 替換成 URL-encode，再放入url進行搜尋。
    $url = 'https://api.learningchocolate.com/v1/resource?word='.$value.'&language=en';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Accept: application/json',
        'apiid: profChanProject',
        'apikey: helloProfChanNiceToMeetYou'
    ));

    $server_output = curl_exec($ch);
    curl_close($ch);
    print $server_output;

?>