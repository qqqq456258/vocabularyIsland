<?php
    $value = $_GET['value'];
    $value = trim($value); //去除字尾空白
    $value = preg_replace('/\s/','%20', $value); // 將字串內的空白從 ASCII Value 替換成 URL-encode ，再放入 url 進行搜尋。
    $url = 'http://api.learningchocolate.com/resource?word='.$value.'&language=en';
    echo file_get_contents($url);
?>