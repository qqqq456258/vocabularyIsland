<?php
    $value = $_GET['value'];
    $url = "http://api.learningchocolate.com/resource?word=".$value."&language=en";
    echo file_get_contents($url);
?>