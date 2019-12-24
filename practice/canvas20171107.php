<?php session_start(); ?>
<!DOCTYPE html>

<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<head>
	<script language="javascript" src="http://tts.itri.org.tw/TTScript/Text2SpeechJsApiV2.php?key=YourLicense">
	</script>
    <title>英語自繪王i-Drawing!</title>
    <script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.4.js"></script>
    <style>
        #logo{
            margin-top: 20px;
        }
        body,input { font-size: 15pt; }
        #dCanvas,#dLine { clear: both; }
        .option
        {
            float: left; width: 20px; height: 20px; border: 2px solid #cccccc;
            margin-right: 4px; margin-bottom: 4px;
            /*background-image: url('localhost/0926/i-drawing/material/plate.png');*/
            background-image: url('material/plate.png');
        }
        .active { border: 2px solid black; }
        .lw { text-align: center; vertical-align: middle; }
        img.output { border: 1px solid green; }
        #cSketchPad { cursor: arrow; }
        body{
            background-image: url('material/bg.jpg');
        	/*background-color: #FFFFBB;*/
        	background-repeat:no-repeat;
            background-size: cover;
        }
        
        #dAll{
            margin: 0px auto;           
            padding-left: 150px;
            /*padding-top: -10px;*/
            
        }
        #div1{
            float: left;
            margin: 0 auto;
            
        }
        #dOutput{
            float: left;
            /*margin: 0 auto;*/
            padding: 20px;
            padding-top: 55px;
        }
        #div2{
            float: left;
            padding: 0px;
            margin-top: 4%;
           /* border-color: #FFA488 dashed;
            border-width: 0px 3px 0px 3px;
            border-style: dashed;*/
        }
        #dreset{
            float: left;
            /*padding-left : 40px;*/
        }
        #dcheck{
            float: left;
            padding-left : 80px;
        }
        #dQuestion{
            font-size: 50px;
        }
       
            
       
        /*錄音部分*/
         ul { list-style: none; }
         #recordingslist audio { display: block; margin-bottom: 10px; }
    </style>
    <script>
        $(function () {
            //產生不同顏色的div方格當作調色盤選項
            var colors =
                "#FF3333;#FF44AA;#FFAA33;#FFFF00;#33FF33;#227700;#33FFFF;#0000FF;#550088;#9900FF;#AA7700;#000000;#F0F8FF".split(';');
            var sb = [];
            $.each(colors, function (i, v) {
                sb.push("<div class='option' style='background-color:" + v + "'></div>");
            });
            $("#dPallete").html(sb.join("\n"));
            //產生不同尺寸的方格當作線條粗細選項
            sb = [];
            for (var i = 1; i <= 10; i++)
                sb.push("<div class='option lw'>" +
                    "<div style='margin-top:#px;margin-left:#px;width:%px;height:%px'></div></div>"
                        .replace(/%/g, i).replace(/#/g, 10 - i / 2));
            $("#dLine").html(sb.join('\n'));
            var $clrs = $("#dPallete .option");
            var $lws = $("#dLine .option");
            //點選調色盤時切換焦點並取得顏色存入p_color，
            //同時變更線條粗細選項的方格的顏色
            $clrs.click(function () {
                $clrs.removeClass("active");
                $(this).addClass("active");
                p_color = this.style.backgroundColor;
                $lws.children("div").css("background-color", p_color);
            }).first().click();
            //點選線條粗細選項時切換焦點並取得寬度存入p_width
            $lws.click(function () {
                $lws.removeClass("active");
                $(this).addClass("active");
                p_width =
                    $(this).children("div").css("width").replace("px", "");

            }).eq(3).click();

            //取得canvas context
            var $canvas = $("#cSketchPad");
            var ctx = $canvas[0].getContext("2d");
            ctx.lineCap = "round";
            ctx.fillStyle = "white"; //整個canvas塗上白色背景避免PNG的透明底色效果
            ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
            var drawMode = false;
            //canvas點選、移動、放開按鍵事件時進行繪圖動作
            $canvas.mousedown(function (e) {
                ctx.beginPath();
                ctx.strokeStyle = p_color;
                ctx.lineWidth = p_width;
                ctx.moveTo(e.pageX - $canvas.position().left, e.pageY - $canvas.position().top);
                drawMode = true;
            })
                .mousemove(function (e) {
                    if (drawMode) {
                        ctx.lineTo(e.pageX - $canvas.position().left, e.pageY - $canvas.position().top);
                        ctx.stroke();
                    }
                })
                .mouseup(function (e) {
                    drawMode = false;
                });
            //確認完成:利用.toDataURL()將繪圖結果轉成圖檔
            $("#bGenImage").click(function () {

                $img_url =  $("#dOutput").html(
                    $("<img />", { id:"img_final", src: $canvas[0].toDataURL(),
                        "class": "output"
                    }));
                document.getElementById("bSendImage").disabled=false;
                $('#bSendImage').attr("src","material/btn_sent.png");

            });

            //重畫
            $("#bReset").click(function () {
                ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
            });

            //出題考同學
            $("#bSendImage").click(function () {
                // ===========================================================================
                // $canvas[0].toDataURL()  是 canvas 轉圖像檔的 base64格式，
                // 當按下"出題考同學"時，將var canvas_to_image 塞進 bSendImage 的 value 中 POST出去
                // ===========================================================================

                var canvas_to_image = $canvas[0].toDataURL();
                document.getElementById('bSendImage').value = canvas_to_image;

            });
        });
        
    </script>
</head>
<body>
 <div id="dAll">
 <table>
     <tr>
        <td>
            <div id="logo"><img src = "material/cover2.png" width="300px" height="180px"></div>
        </td>
         <td >
         <!-- <div style=" padding-left: 800px; ">
              <input type="image" src = "material/btn_guess.png" style="width:310px;height:105px;" value="猜大家畫什麼" onclick="location.href = 'http://localhost/0926/i-drawing/practice.php'"> 
               <input type="image" src = "material/btn_watch.png" style="width:300px;height:100px;" value="看看同學的作品" onclick="location.href = 'http://localhost/0926/i-drawing/showall.php'">
               <input type="image" src = "material/btn_userpage.png" style="width:300px;height:100px;" value="回去我的作品" onclick="location.href = 'http://localhost/0926/i-drawing/userpage.php'"> 
         </div> -->
         <div style=" padding-left: 800px; ">
              <input type="image" src = "material/btn_guess.png" style="width:310px;height:105px;" value="猜大家畫什麼" onclick="location.href = 'practice.php'"> 
               <input type="image" src = "material/btn_watch.png" style="width:300px;height:100px;" value="看看同學的作品" onclick="location.href = 'showall.php'">
               <input type="image" src = "material/btn_userpage.png" style="width:300px;height:100px;" value="回去我的作品" onclick="location.href = 'userpage.php'"> 
         </div>
                
         </td>
         <!-- <td>
             
         </td> -->
         
     </tr>
 </table>
    <!-- <div id="logo"><img src = "material/cover2.png" width="380px" height="250px"></div> -->
    
    </div>
    <hr color=" #483D8B" size="3" width="100%" style="margin-top:3px;"> 
    <!-- <embed src="sound/animal.mp3" autostart =0 loop="false" width="280" height="50" playcount="3"></embed> -->
    
    <h1>
    <div id="dQuestion">
     <?
    	 // ===========================================================================
        // 可以在這裡把路徑加檔名存進資料庫欄位中，我想 $file 可能就是路徑
        // ===========================================================================
        //		//連接資料庫
        		$dbhost = 'localhost';
        		$dbuser = 'root';
        		$dbpass = 'cjo4hjp6';  
        		$dbname = 'tomorrowenglish';
        		$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
        		mysql_query("SET NAMES 'utf8'");
        		mysql_select_db($dbname);
                //誰登入
                // $uid = $_SESSION['user'];
                
        		//顯示要畫的題目
        		$sql_showQuestion = "SELECT eng_vacabulary, chi_vacabulary FROM everybody_up ORDER BY RAND() LIMIT 1";
        		$result = mysql_query($sql_showQuestion);
        		while($r = mysql_fetch_array($result))
        		{
        			$vacabulary_name = $r[eng_vacabulary];
                    $vacabulary_chiname = $r[chi_vacabulary];
    				$_SESSION["id"] = $vacabulary_name;
                    $_SESSION["cid"] = $vacabulary_chiname;
    				echo "<img src = material/question.png margin-top:0px;/>".$r[eng_vacabulary]." ".$r[chi_vacabulary];
            // echo "<h4 id='eng_sound' onmouseover=playSound();>".$r[eng_vacabulary]."</h4>";
        		}
     ?>

     </div>
    </h1>

      <div id='div1'>
        <div id="plate_line">
            <div id="dPallete"></div>
            <div id="dLine"></div>
      </div> <!-- div1 -->
        
        <div id="dCanvas">
            <canvas id="cSketchPad" width="500" height="500" style="border: 2px solid gray"  />
        </div>

        <div id = "dreset" >
            <input type="image" id="bReset" value="我要重畫" src='material/btn_drawagain.png' width="200px" height="70px" onclick="reset();return false;"></input>
        </div>
        <div id = "dcheck">
            <input type="image" id="bGenImage" src='material/btn_done.png' width="200px" height="70px" value="確認完成" />
        </div>
        <!-- <div id="dOutput"></div> -->
    </div>
    <div id="dOutput"></div>

    <!-- ===============================================================================
    form 的 action 換轉到saveImage.php中，並用POST傳出去，input 我加上 name="Saveimage" 屬性，
    這樣才可以再saveImage.php 用 $_POST 接。
    ===============================================================================  -->
    <div id='dSaveImage'>
        <form action="saveImage.php" method="post">
        	<div id='div2'><img src="material/writehint2.png" width="450px" height="150px">
            <!-- <h1>給同學一些提示吧</h1> -->
            <table  border=0 >
            <!-- 學生聯想 id="tHint" -->
            <tr>
                 <td>
                    <div><img src="material/keyword.png" width="250px" height="70px"></div>
                 </td>
                 <td>
                    <h2><input type="text" name ="savehint" id="tHint" style="font-size: 30px;width: 250px" ;/></h2>
                 </td>

            </tr>
           
            <!-- 學生聯想 -->

            <!-- <tr>
                <td>
                    <div><img src="material/keyword2.png" width="250px" height="70px"></div>
                </td>
                <td>
                    <h2><input type="text" name ="savehint2" id="tHint2" /p></h2> 
                </td>
            </tr> -->
            
    		
          
             <tr>
             <!-- <td> -->
                 <!-- <input type="submit" name="saveimage" id="bSendImage" value="OK! 出題考同學" disabled="true" /> -->
                  <td>
                      <input type="image" src="material/btn_sent01.png" width="250px" height="130px" name="saveimage" id="bSendImage" value="OK! 出題考同學" disabled="true" /> 

                  </td>
                  <td>
                      <h5 style="padding-top: 50px;">注意!要完成作品才能出題考同學唷!</h5>
                  </td>
                  
             <!-- </td> -->
             </tr>

              </table>
              <!-- <script src="recorder.js"></script> -->
             <br>
             <script type="text/javascript">
                    var infoBox; // 訊息 label
                    var textBox; // 最終的辨識訊息 text input
                    var tempBox; // 中間的辨識訊息 text input
                    var startStopButton; // 「開始辨識/停止」按鈕
                    var final_transcript = ''; // 最終的辨識訊息的變數
                    var recognizing = false; // 是否辨識中
                    function startButton(event) {
                      infoBox = document.getElementById("infoBox"); // 取得訊息控制項 infoBox
                      textBox = document.getElementById("textBox"); // 取得最終的辨識訊息控制項 textBox
                      tempBox = document.getElementById("tempBox"); // 取得中間的辨識訊息控制項 tempBox
                      //question = document.getElementById("question");
                      readaloudresult = document.getElementById("readaloudresult");
                      startStopButton = document.getElementById("startStopButton"); // 取得「辨識/停止」這個按鈕控制項
                      langCombo = document.getElementById("langCombo"); // 取得「辨識語言」這個選擇控制項
                      if (recognizing) { // 如果正在辨識，則停止。
                        recognition.stop();
                      } else { // 否則就開始辨識
                        textBox.value = ''; // 清除最終的辨識訊息
                        tempBox.value = ''; // 清除中間的辨識訊息
                        final_transcript = ''; // 最終的辨識訊息變數
                        recognition.lang = langCombo.value; // 設定辨識語言
                        recognition.start(); // 開始辨識
                      }
                    }

                    if (!('webkitSpeechRecognition' in window)) {  // 如果找不到 window.webkitSpeechRecognition 這個屬性
                      // 就是不支援語音辨識，要求使用者更新瀏覽器。 
                      infoBox.innerText = "本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)";
                    } else {
                      var recognition = new webkitSpeechRecognition(); // 建立語音辨識物件 webkitSpeechRecognition
                      recognition.continuous = true; // 設定連續辨識模式
                      recognition.interimResults = true; // 設定輸出中先結果。

                      recognition.onstart = function() { // 開始辨識
                        recognizing = true; // 設定為辨識中
                        startStopButton.value = "按此停止"; // 辨識中...按鈕改為「按此停止」。  
                        infoBox.innerText = "辨識中...";  // 顯示訊息為「辨識中」...
                      };

                      recognition.onend = function() { // 辨識完成
                        recognizing = false; // 設定為「非辨識中」
                        startStopButton.value = "開始辨識";  // 辨識完成...按鈕改為「開始辨識」。
                        infoBox.innerText = ""; // 不顯示訊息
                      };

                      recognition.onresult = function(event) { // 辨識有任何結果時
                        var period=".";
                        var interim_transcript = ''; // 中間結果
                        for (var i = event.resultIndex; i < event.results.length; ++i) { // 對於每一個辨識結果
                          if (event.results[i].isFinal) { // 如果是最終結果
                            final_transcript += event.results[i][0].transcript; // 將其加入最終結果中
                            document.getElementById('tHint').value = final_transcript; 
                          } else { // 否則
                            interim_transcript += event.results[i][0].transcript+period; // 將其加入中間結果中
                          }
                        }
                        if (final_transcript.trim().length > 0) // 如果有最終辨識文字
                            textBox.value = final_transcript; // 顯示最終辨識文字
                        if (interim_transcript.trim().length > 0) // 如果有中間辨識文字
                            tempBox.value = interim_transcript; // 顯示中間辨識文字     
                        
                      };
                    }
             </script>
                <!-- 題目: <script>show_question();</script> <BR/> -->
                辨識完的文字：<input id="textBox" type="text" size="60" value=""/><BR/>
                辨識中的文字：<input id="tempBox" type="text" size="60" value=""/><BR/>
                
                辨識語言：
                <select id="langCombo">
                  <!-- <option value="en-US">英文(美國)</option> -->
                  <option value="cmn-Hant-TW">中文(台灣)</option>
                </select>
                <input id="startStopButton" type="button" value="辨識" onclick="startButton(event)"/><BR/>
                <label id="infoBox"></label>
                 
              

        </div>
        </tr>
        </form>   
        </form> 
        <!-- <form action="saveRecord.php" method="post">           -->
    </div>
</div> 
    </body>

</html>