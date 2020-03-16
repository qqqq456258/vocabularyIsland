$(function () {
    /* 系統所需全域變數。*/
    let word = []; // 宣告陣列放入 4 個單字。
    let partOfSpeech = []; // 宣告陣列放入 4 個單字詞性。
    let definition = []; // 宣告陣列放入 4 個單字翻譯。
    let file_word = [];     //存放去除空格的檔案名稱。
    let hint = ""; // 存放去除字母以外的單字提示。
    let order = []; // 宣告陣列放入排序。
    let sound = []; // 宣告陣列放入 4 個語音檔。
    let record_num = 0; // 存放按擊錄音次數。
    let stop_num = 0; // 存放按擊暫停次數。
    let choose_audio = ""; // 存放二個錄音中所選擇的audio ID，可以再去 audio_base64 陣列中找 base64。
    let audio_base64 = []; // 存放2次語音的 base64。
    let step = 1;   // 控制步驟的參數 (1 ~ 3) 。
    let round = 0;  // 控制下一個單字出現 (0 ~ 3) 。
    let move = 0;   // 基礎練習總共步驟 (0 ~ 27) 。
    

    /* Recorder.js 所需全域變數。*/
    var URL = window.URL || window.webkitURL;
    var gumStream = null; //stream from getUserMedia()
    var rec = null; //Recorder.js object
    var input = null; //MediaStreamAudioSourceNode we'll be recording
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = audioContext || null;//audio context to help us record
    
    
    /* 紀錄所需全域變數 */
    let listen_num = 0;                 // 存放 聆聽次數。
    let tip_num = 0;                    // 存放 提示點擊次數。
    let wrong_time = 0;                 // 存放 錯誤次數。
    let select_target = 0;              // 存放 語音目標 1 or 2。
    let delete_time = 0;                // 存放 重錄次數。
    
    let this_page = new URL(location.href); //取得完整網址（URL）。
    let theme = this_page.searchParams.get('theme');
    let title = this_page.searchParams.get('title');
    let practice = this_page.searchParams.get('practice');
    
    /*new Date() 的 擴充語法，表示 format("yyyy-MM-dd hh:mm:ss") 的時間格式。*/
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小時
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
      if (new RegExp("(" +  k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" +  o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
    Date.prototype.addSeconds = function(seconds) {
      this.setSeconds(this.getSeconds() + seconds);
      return this;
    }
    Date.prototype.addMinutes = function(minutes) {
      this.setMinutes(this.getMinutes() + minutes);
      return this;
    }
    Date.prototype.addHours = function(hours) {
      this.setHours(this.getHours() + hours);
      return this;
    }
    Date.prototype.addDays = function(days) {
      this.setDate(this.getDate() + days);
      return this;
    }
    Date.prototype.addMonths = function(months) {
      this.setMonth(this.getMonth() + months);
      return this;
    }
    Date.prototype.addYears = function(years) {
      this.setFullYear(this.getFullYear() + years);
      return this;
    }
    function diffSeconds(milliseconds) {
      return Math.floor(milliseconds / 1000);
    }
    function diffMinutes(milliseconds) {
      return Math.floor(milliseconds / 1000 / 60);
    }
    function diffHours(milliseconds) {
      return Math.floor(milliseconds / 1000 / 60 / 60);
    }
    function diffDays(milliseconds) {
  return Math.floor(milliseconds / 1000 / 60 / 60 / 24);
}
    
    let date_time = new Date().format("yyyy-MM-dd hh:mm:ss");
    
    
/*

Log :

    1. 按了幾次語音按鈕。listen_num
    2. 挑選語音時的偏好(1 or 2)。choose_audio
    3. 重新錄音的次數(與原因)。
    4. 拼字步驟時，使用語音按鈕、提示的次數。

*/

    
    
    /* 將點擊語音的紀錄插入資料庫。*/
    function insert_click_sound(whichStep,whichWord,dateTime){
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/basic_practices.php",
            data: {
                code: 0,
                target: word[order[whichWord]],
                click_step: whichStep,
                theme_code:theme,
                title_code:title,
                click_time:listen_num,
                date_time:dateTime,
                practice_code:practice
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
                listen_num = 0; //歸零。
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                alert('insert_click_sound: Wrong !!');
                
            }
        });
    }
    /* 將錄音選擇的紀錄插入資料庫。*/
    function insert_select_record(whichWord,select_target,dateTime){
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/basic_practices.php",
            data: {
                code: 1,
                target: word[order[whichWord]],
                select_target: select_target,
                theme_code:theme,
                title_code:title,
                practice_code:practice,
                date_time:dateTime
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
                select_target = 0;  //歸零。
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                alert('insert_select_record : Wrong !!');
                
            }
        });
    } 
    /* 將刪除語音的紀錄插入資料庫。*/
    function insert_delete_record(whichWord,delete_time,dateTime){
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/basic_practices.php",
            data: {
                code: 2,
                target: word[order[whichWord]],
                theme_code:theme,
                title_code:title,
                practice_code:practice,
                delete_time:delete_time,
                date_time:dateTime
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
                delete_time = 0; //歸零。
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                alert('insert_delete_record : Wrong !!');
                
            }
        });
    } 
    /* 將點擊提示的紀錄插入資料庫。*/
    function insert_click_tip(whichStep,whichWord,dateTime){
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/basic_practices.php",
            data: {
                code: 3,
                target: word[order[whichWord]],
                click_step: whichStep,
                theme_code:theme,
                title_code:title,
                practice_code:practice,
                tip_num:tip_num,
                date_time:dateTime
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
                tip_num = 0; //歸零。
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                alert('insert_click_tip : Wrong !!');
                
            }
        });
    }
    /* 將錄製的語音紀錄插入資料庫。*/
    function insert_record(whichWord,select_target,dateTime){
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/basic_practices.php",
            data: {
                code: 4,
                target: word[order[whichWord]],
                audURI: audio_base64[select_target],
                theme_code:theme,
                title_code:title,
                practice_code:practice,
                date_time:dateTime
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                alert('insert_record : Wrong !!');
                
            }
        });
    } 
    /* 將拼字步驟錯誤次數插入資料庫。*/
    function insert_wrong_time(whichStep,whichWord,wrongTime,dateTime){
        
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/basic_practices.php",
            data: {
                code: 5,
                target: word[order[whichWord]],
                wrong_step: whichStep,
                wrong_time: wrongTime,
                theme_code:theme,
                title_code:title,
                practice_code:practice,
                date_time:dateTime
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
                wrong_time = 0;     //全域變數歸零。
                console.log('wrong_time 歸零，'+wrong_time);
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                alert('insert_wrong_time : Wrong !!');
                
            }
        });
    } 
    /* 抓本單元的四個單字相關資訊 */
    function get_vocbulary(){
        $.ajax({
            type: "POST",
            async: false, //async設定true會變成異步請求。
            cache: true,
            url: "php/basic_practices.php",
            data: {
                code: 6,
                theme_code:theme,
                title_code:title,
                practice_code:practice
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                for(let i = 0 ; i<4 ; i++){
                    word[i] = json['get_vocbulary'][i]['vl_vocabulary'];
                    partOfSpeech[i] = json['get_vocbulary'][i]['vl_part_of_speech'];
                    definition[i] = json['get_vocbulary'][i]['vl_definition'];
                }
                console.log('單字資訊載入完成。'); 
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseText);
            }


               
        });
    }
    /* 將完成基礎練習的紀錄插入資料庫。*/
    function insert_done(dateTime){
        $.ajax({
            type: "POST",
            async: false, //async設定true會變成異步請求。
            cache: true,
            url: "php/basic_practices.php",
            data: {
                code: 7,
                theme_code:theme,
                title_code:title,
                practice_code:practice,
                date_time:dateTime
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                alert('insert_done : Wrong !!');
                
            }
        });
    } 
     
     
    /* sweetAlert2 的功能。*/
    function dialog(situation) {
        console.log("Dialog:" + situation);
        if (situation == 0) { //遊戲開始前說明。
            swal.fire({
                    icon: "info",
                    title: "Basic Practice",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;text-align: left;padding-left: 10px;'>1. 試著練習發音<b>兩次</b>。<br>2. 與標準發音比較，<b>挑出最滿意的錄音結果</b>。<br>3. 最後，試著聆聽發音並<b>拼出</b>單字。</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: " O K "
                })
                .then((result) => {
                    if (result.value) {
                        console.log("進入基礎練習。");
                    }
                });
        } else if (situation == 1) { // 未挑選單字發音的提示。
            $('#sound_wrong').get(0).play();
            swal.fire({
                    icon: "error",
                    title: "Error",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>請將兩個錄音與標準發音比較，<br><b>挑出一個最滿意的</b>。</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        console.log("忘記挑選錄音。");
                    }
                });
        } else if (situation == 2) { // STEP 2 的提示。
            swal.fire({
                    title: $("#word").text(),
                    html: "<p style='font-family:support;font-size:22px;font-weight: 900;'>" + $("#part_speech").text() + " " + $("#definition").text() + "</p>",
                    imageUrl: 'material/animat-pencil-color.gif',
                    imageWidth: 64,
                    imageHeight: 64,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        tip_num++;
                        console.log("在 Step 2 使用提示。");
                    }
                });
        } else if (situation == 3) { // STEP 3 的提示。
            swal.fire({
                    title: $("#word").text(),
                    html: "<p style='font-family:support;font-size:22px;font-weight: 900;'>" + $("#part_speech").text() + " " + $("#definition").text() + "</p>",
                    imageUrl: 'material/animat-pencil-color.gif',
                    imageWidth: 64,
                    imageHeight: 64,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        tip_num++;
                        console.log("在 Step 3 使用提示。");
                    }
                });
        } else if (situation == 4) { // 完成後給的存檔回應。
            
            
            insert_click_sound(step-2,round,date_time);             // 紀錄點擊發音之次數。
            insert_record(round,select_target,date_time);           // 創建錄音檔並做紀錄。
            insert_select_record(round,select_target,date_time);    // 紀錄選擇的錄音選項。
            insert_delete_record(round,delete_time,date_time);      // 紀錄刪除錄音次數。
            
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 700
            })
        } else if (situation == 5) { // 完成基礎練習。
            swal.fire({
                    icon: "success",
                    title: "完成",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>恭喜完成<b>挑選練習</b><br>前往製作自己的字卡吧！！</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        insert_done(date_time);
                        console.log("前往製作自己的字卡吧！！");
                        location.replace('visualizing.html?theme='+theme+'&title='+title+'&practice='+practice);
                        
                    }
                });
        } else if (situation == 6) { // 重新複誦步驟。
            swal.fire({
                    icon: "warning",
                    title: "Are you sure?",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>要重新錄音嗎？</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                })
                .then((result) => {
                    if (result.value) {
                        
                        delete_time++;
                        
                        choose_audio = "";
                        record_num = 0;
                        stop_num = 0;
                        var regex = /\s/;
                        let vocabulary = $("#word").text();
                        vocabulary = vocabulary.replace(regex, '');

                        $('#record').attr('src', 'material/record_1.png'); //錄音按鈕開啟。
                        $('#record').removeAttr('disabled'); //錄音按鈕開啟。
                        $('#stop').attr('src', 'material/stop_0.png'); //暫停按鈕關閉。
                        $('#stop').attr('disabled', 'disabled'); //暫停按鈕關閉。
                        $("#title_en").text("Record your pronunciation ( " + stop_num + " / 2 )");
                        for (let i = 1; i < 3; i++) {
                            $('#voice_zone_' + i).css('border', '5px dashed gray');
                            $("#voice_" + i).attr('disabled', 'disabled'); //將錄完音的結果鎖起來，不給播放。
                            $('#audio_' + vocabulary + '_' + i).remove();
                            $("#voice_" + i).css('visibility', 'hidden'); //錄完音的結果隱藏。
                        }
                        $('#stop,#record').css('display', 'inline-block');
                        $('#vocabulary').css('height', '320px');
                        $('#vocabulary').css('marginTop', '90px');
                        $('#click_zone').css('display', 'none');
                        move = move - 2;
                        progress();
                        console.log("刪除原先錄音內容，重新進行。");
                    }
                });
        } else { //STEP 2,3 的結果提示。 
            let icon = "";
            if ($('#tip').text() == "Correct.") {
                $('#sound_correct').get(0).play(); //播放正確音效。
                icon = "success";
                console.log("Correct");
            } else {
                $('#sound_wrong').get(0).play();
                icon = "error";
                console.log("Wrong");

            }
            swal.fire({
                    icon: icon,
                    title: $("#word").text(),
                    html: "<p style='font-family:support;font-size:22px;font-weight: 900;'>" + $("#part_speech").text() + " " + $("#definition").text() + "</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        if (step == 3) { // 一開始的初步拼字。
                            play_sound(3);
                            progress();
                            if (icon == "success") { // 答對，就進入下一階段。
                                
                                insert_click_sound(step-2,round,date_time);         // 點擊發音之紀錄。
                                insert_click_tip(step-3,round,date_time);           // 紀錄點擊提示次數。
                                if(wrong_time>0){                                   // 記錄錯誤之紀錄。
                                    insert_wrong_time(step-3,round,wrong_time,date_time);
                                }
                                
                                console.log("答對，下一階段。");

                                $('#title_en').text('Spell the word completely'); //變更標題。
                                $('#tip').text(''); //清空內容。
                                $('#answer').val(''); //清空內容。

                                /*加強空白寬度的提示。*/
                                var regex = /\s/;
                                let vocabulary = $("#word").text();
                                let vocabulary_length = vocabulary.replace(regex,'  ');
                                console.log("vocabulary_length:" + vocabulary_length);

                                /*單字長度的提示。*/
                                regex = /[a-zA-Z]/gi;
                                vocabulary = $("#word").text();
                                vocabulary_length = vocabulary.replace(regex, ' _ ');

                                $('#spell_title').text(vocabulary_length); //幫助學生拼字。
                                $('#hint').attr('src', 'material/tips_again.png'); //換一個暗示圖形，表示內容變更。
                                $('#next_btn').attr('src', 'material/done.png');

                            } else { // 答錯，就繼續拼字。
                                
                                wrong_time++;
                                console.log('wrong_time:'+wrong_time);
                                
                                $('#title_en').text('Try again'); //變更標題。
                                $('#answer').val('');
                                $('#tip').css('color', 'black');
                                $('#tip').text('Keep going...');
                                move = move - 2;
                                progress();
                                step--;
                                console.log("答錯，再來一次。");
                            }

                        } else { // 第二次的完整拼字。
                            progress();

                            if (icon == "success") { // 答對，就進入下一階段。
                                
                                insert_click_sound(step-2,round,date_time);         // 點擊發音之紀錄。
                                insert_click_tip(step-3,round,date_time);           // 紀錄點擊提示次數。
                                if(wrong_time>0){                                   // 記錄錯誤之紀錄。
                                    insert_wrong_time(step-3,round,wrong_time,date_time);
                                }
                                
                                if (move < 28) {
                                    init_content(); //初始化。
                                    prepare(round); //載入單字。
                                    $('#sound').attr('src','material/speaker_3.png');
                                    $('#sound').css('display','inline-block');
                                    console.log("答對，下一階段。");

                                } else {
                                    dialog(5);

                                }

                            } else { // 答錯，就繼續拼字。
                                play_sound(3);
                                wrong_time++;
                                console.log('wrong_time:'+wrong_time);
                                
                                $('#title_en').text('Try again'); //變更標題。
                                $('#answer').val('');
                                $('#tip').css('color', 'black');
                                $('#tip').text('Keep going...');
                                move = move - 2;
                                progress();
                                step--;
                                console.log("答錯，再來一次。");

                            }
                        }
                    }
                });
        }
    }
    /* 播放語音 */
    function play_sound(time) {
        
        /*替換空格的提示。*/
        var regex = /\s/;
        let vocabulary = $("#word").text();
        vocabulary = vocabulary.replace(regex, '');
        
          // Show loading animation.
          var playPromise = $('#sound_' + vocabulary).get(0).play();

          if (playPromise !== undefined) {
            playPromise.then(_ => {
              $('#sound_' + vocabulary).get(0).pause();
            })
            .catch(error => {
                console.log(error);
              // Auto-play was prevented
              // Show paused UI.
            });
          }

        if(time == 1){
            var timeout_0 = setTimeout(function () {
                $('#sound_' + vocabulary).get(0).play(); /*播放一次語音*/
            }, 300);
        }else{
            var timeout_1 = setTimeout(function () {
                $('#sound_' + vocabulary).get(0).play(); /*播放第一次語音*/
            }, 300);
            var timeout_2 = setTimeout(function () {
                $('#sound_' + vocabulary).get(0).play(); /*播放第二次語音*/
            }, 1900);
            var timeout_3 = setTimeout(function () {
                $('#sound_' + vocabulary).get(0).play(); /*播放第三次語音*/
            }, 3500);
        }

        
    }
    /* 初始化 */
    function init_content() {
        round++;//下一個。
        step = 1;
        listen_num = 0;
        record_num = 0;
        stop_num = 0;
        $('#tip').text(''); //清空內容。
        $('#answer').val(''); //清空內容。
        $('#answer').removeAttr('placeholder');
        $('#hint').attr('src', 'material/tips.png'); //換暗示圖形，表示內容變更。
        $('#next_btn').attr('src', 'material/next_step.png'); //換下一步的按鈕。
        $('#spell_zone').css('display', 'none'); 
        $('#click_zone').css('display', 'none');
        $('#clear').css('display','inline-block');
        $('#sound').css('display','none');
        $('#vocabulary').css('marginTop', '90px');
        $('#vocabulary').css('display', 'block');
        $('#record,#stop').css('display', 'none');
        select_target = 0;
        choose_audio = "";
        for (let i = 1; i < 4; i++) {
            $('#voice_zone_' + i).css('border', '5px dashed gray');
        }

        /*
            $('#sound').off('click');
            $('#spell_sound').off('click');
            $('#record').off('click');
            $('#stop').off('click');
            $('.voice').off('click');
            $('#next_btn').off('click');
            $('#hint').off('click');
        */

        console.log("初始化");

    }
    /* 隨機產生不重覆的4個數字。*/
    function getRandomArray() {
        var rdmArray = [4]; //儲存產生的陣列。

        for (var i = 0; i < 4; i++) {
            var rdm = 0; //暫存的亂數。

            do {
                var exist = false; //此亂數是否已存在。
                rdm = Math.floor(Math.random() * 4); //取得亂數

                //檢查亂數是否存在於陣列中，若存在則繼續回圈。
                if (rdmArray.indexOf(rdm) != -1) exist = true;

            } while (exist); //產生沒出現過的亂數時離開迴圈。

            rdmArray[i] = rdm;
        }
        return rdmArray;
    }
    /* 進度條*/
    function progress() {
        let total_move = 28;
        move++;
        percentage = Math.floor(move / 28 * 100);
        if (percentage < 25) {
            $('#progress_bar').css('backgroundColor', '#5C9DFF');
        } else if (percentage >= 25 && percentage < 50) {
            $('#progress_bar').css('backgroundColor', '#58E8D3');
        } else if (percentage >= 50 && percentage < 75) {
            $('#progress_bar').css('backgroundColor', '#6EFF77');
        } else if (percentage >= 75 && percentage < 100) {
            $('#progress_bar').css('backgroundColor', '#FFCA5F');
        } else {
            $('#progress_bar').css('backgroundColor', '#E73F32');
        }
        $('#progress_bar').css('width', percentage + '%');
        console.log("百分比：" + percentage + "%");
        console.log("總共：" + move + "步。");
    }
    /* 載入聲音檔。*/
    function loading_sound(someNumber) {
        let i = someNumber;
        $.ajax({
            type: "get",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/get_data_from_LearningChocolate.php",
            data: {
                value: word[order[i]],
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json.length);
                if(json.length != 0){
                    sound[order[i]] = document.createElement("audio"); //創建聲音檔元件。
                    sound[order[i]].setAttribute("id", "sound_" + file_word[order[i]]); //問題點
                    sound[order[i]].setAttribute("src", json[0].sounds[0].fileName);
                    sound[order[i]].setAttribute("preload", "auto");
                    document.body.appendChild(sound[order[i]]); //把它添加到頁面上。
                    
                }else{
                    sound[order[i]] = document.createElement("audio"); //創建聲音檔元件。
                    sound[order[i]].setAttribute("id", "sound_" + file_word[order[i]]);
                    sound[order[i]].setAttribute("src", "word_sound/" + file_word[order[i]] + ".mp3");
                    sound[order[i]].setAttribute("preload", "auto");
                    document.body.appendChild(sound[order[i]]);
                }
                if (i == 0) {
                    $('#sound').css('display', 'inline-block');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                
            }


               
        });
    }
    /* 四個單字的順序洗牌。*/
    function prepare(round) {
        let i = round;
        console.log("order:" + order);
        console.log("word:" + word[order[i]]);
        console.log("round:" + round);

        /*放入這次學習的單字。*/
        $("#title_en").text("Listen to the pronunciation  3  times");
        $("#word").text(word[order[i]]);
        $('#img').attr('src','word_image/'+file_word[order[i]]+'_'+Math.floor(Math.random() * 3)+'.jpg');
        $("#part_speech").text(partOfSpeech[order[i]]);
        $("#definition").text(definition[order[i]]);
        
        /*加強空白寬度的提示。*/
        var regex = /\s/;
        let vocabulary = $("#word").text();
        hint = vocabulary.replace(regex,'  ');

        /*去除母音字母的提示。*/
        regex = /[^aeiouAEIOU\s]/gi;
        hint = hint.replace(regex, ' _ ');
        console.log("Hint:" + hint);
        
        if(i == 0){
            loading_sound(0);
        }
    }
    
    

    get_vocbulary();
    order = getRandomArray();
    for (let k = 0; k < 4; k++) {
        /*去除空格。*/
        var regex = /\s/;
        file_word[k] = word[k].replace(regex, '');
    }
    prepare(round);
    dialog(0);

    
    
    
    /*練習發音時，點擊聽單字發音*/
    $('#sound').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        /*播放語音*/
        play_sound(1);
        if (listen_num == 0) { //僅有第一次點擊才變化。
            $('#image_zone').css('display','flex');
            $('#sound').attr('src','material/speaker_2.png');
            progress();
            listen_num++;
            
        }else if(listen_num == 1){
            $('#info_zone').css('display','flex');
            $('#sound').attr('src','material/speaker_1.png');
            progress();
            listen_num++;
            
        }else if(listen_num == 2){
            $('#sound').attr('src','material/speaker.png');
            $("#title_en").text("Record your pronunciation ( 0 / 2 )"); //變更標題。
            $('#vocabulary').css('height', '320px'); //單字區塊變長。
            $('#record,#stop').css('display', 'inline-block'); //將錄音與暫停按鈕並排。
            $('#voice_zone').css('display', 'block'); //錄音的結果出現。
            progress();
            listen_num++;
        }else{
            listen_num++;
        }
    });
    
    $('#spell_sound').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        /*播放語音*/
        play_sound(1);
        listen_num++;
    });


    /*  調整錄音按鈕的顯示與隱藏、效果。 */
    $('#record').on('click', function () {
        event.preventDefault();
        event.stopPropagation();
        startRecording();
        $(this).attr('src', 'material/record_0.png'); //錄音按鈕關閉。
        $(this).attr('disabled', 'disabled'); //錄音按鈕關閉。
        $('#stop').attr('src', 'material/stop_1.png'); //暫停按鈕開啟。
        $('#stop').removeAttr('disabled'); //暫停按鈕開啟。
        record_num++; //錄音按鈕點擊次數。
    });

    /*  錄音結束按鈕的顯示與隱藏、效果。 */
    $('#stop').on('click', function () {
        stopRecording();
        $(this).attr('src', 'material/stop_0.png'); //暫停按鈕關閉。
        $(this).attr('disabled', 'disabled'); //暫停按鈕關閉。
        $('#record').attr('src', 'material/record_1.png'); //錄音按鈕開啟。
        $('#record').removeAttr('disabled'); //錄音按鈕開啟。
        stop_num++; //暫停按鈕點擊次數。
        if (stop_num > 0 && stop_num < 2) { // 第1~2次 錄音。
            $("#title_en").text("Record your pronunciation ( " + stop_num + " / 2 )");
            $("#voice_" + stop_num).css('visibility', 'visible'); //錄完音的結果出現。
            $("#voice_" + stop_num).attr('disabled', 'disabled'); //將錄完音的結果鎖起來，不給播放。
        } else { //第2次錄音之後。
            $("#voice_" + stop_num).css('visibility', 'visible'); //錄完音的結果出現。
            $("#voice_1,#voice_2,#next_btn").removeAttr('disabled'); //將錄完音的結果都解鎖。
            $('#stop,#record').css('display', 'none'); //隱藏錄音及暫停按鈕。
            $('#image_zone').css('display', 'none');    // 圖片區塊隱藏。
            $('#info_zone').css('display', 'none');     // 單字資訊區塊隱藏。
            $('#vocabulary').css('height', '200px'); //隱藏單字區塊。
            $('#vocabulary').css('marginTop', '70px'); //往上調整單字區塊位置。
            $("#title_en").text("Listen to and pick up the best one"); //變更標題。
            $('#click_zone').css('display', 'block');
            progress();
        }
    });

    /*  錄音結束後，點擊自己的聲音，並呈現選擇錄音的變化效果。*/
    $('.voice').on('click', function () {
        event.preventDefault();
        event.stopPropagation();
        var audio_num = $(this).attr('id').split("_");
        select_target = audio_num[1];
        /*替換空格的提示。*/
        var regex = /\s/;
        let vocabulary = $("#word").text();
        vocabulary = vocabulary.replace(regex, '');

        choose_audio = 'audio_' + vocabulary + '_' + audio_num[1]; // 選擇錄音的對象。
        console.log('Play - #' + choose_audio);
        
//        alert('Play - #' + choose_audio);
        
        $('#' + choose_audio).get(0).play();
        for (let i = 1; i < 3; i++) {
            $('#voice_zone_' + i).css('border', '5px dashed gray');
        }
        $('#voice_zone_' + audio_num[1]).css('border', '5px solid red');

    });

    $('#clear').on('click', function () {
        event.preventDefault();
        event.stopPropagation();

        dialog(6);

    });


    /*點擊下一步。*/
    $('#next_btn').on('click', function () {
        event.preventDefault();
        event.stopPropagation();
        step++;
        if (choose_audio.length == 0) { //忘了挑選錄音。
            step--;
            dialog(1);

        } else if (step == 2) {
            dialog(4);
            $('#clear').css('display', 'none');
            $('#title_en').text('Spell the word'); //變更標題。
            $('#vocabulary').css('display', 'none');    // 單字區塊隱藏。
            $('#image_zone').css('display', 'none');    // 圖片區塊隱藏。
            $('#info_zone').css('display', 'none');     // 單字資訊區塊隱藏。
            $("#voice_1,#voice_2,#voice_3").removeAttr('disabled'); //將錄完音的按鈕解鎖。
            $("#voice_1,#voice_2,#voice_3").css('visibility', 'hidden'); //將錄完音的按鈕隱藏。
            $('#voice_zone').css('display', 'none'); //錄音區塊隱藏。
            $('#spell_title').text(hint); //幫助學生拼字。
            $('#spell_zone').css('display', 'block'); //拼字區塊出現。
            $('#next_btn').attr('src', 'material/done.png');
            /*播放語音*/
            play_sound(3);
            progress();
            if(round == 0){ // 趁第一次拼字的空檔讀取其他三個的語音檔。
                for(let i = 1 ; i < 4 ; i++ ){
                    loading_sound(i);
                }
            }

        } else if (step == 3) {
            dialog(2020);

        } else {
            dialog(2020);
            console.log("下一個單字。");
        }

    });

    /*即時字元檢測。*/
    $('#answer').bind("input propertychange", function (e) {
        let input_value = $('#answer').val().toLowerCase();
        $('#answer').val(input_value);
        let vocabulary = $('#word').text();
        console.log('vocabulary:' + vocabulary);
        console.log('input_value:' + input_value);

        if (vocabulary == input_value) { //完全正確。
            $('#tip').css('color', 'green');
            $('#tip').text("Correct.");
        } else if (vocabulary.substring(0, input_value.length) == input_value) { //往正確的道路邁進。
            $('#tip').css('color', '#F9950D');
            $('#tip').text("Keep going, " + (vocabulary.length - input_value.length) + " letters left.");
        } else { //完全錯誤。
            $('#tip').css('color', '#DB0000');
            $('#tip').text("Wrong.");

        }
    });

    /*點擊暗示按鈕時。*/
    $('#hint').on('click', function () {
        if ($(this).attr('src') == "material/tips.png") {
            dialog(2);
        } else {
            dialog(3);
        }
    })


    function startRecording() {
        console.log("recordButton clicked");
        var constraints = {
            audio: true,
            video: false
        };
        
        (async () => {
            try {
                
                rec = null; //Recorder.js object
                input = null; //MediaStreamAudioSourceNode we'll be recording
                
                console.log("The parameter settings of startRecording function have already initialized.");
                
                gumStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
                console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
                
                if (AudioContext) {
                    // Do whatever you want using the Web Audio API
                    if(!audioContext){
                        audioContext = new AudioContext;
                    }else{
                        audioContext = audioContext;
                    }
                    
                    
//                    audioContext = new AudioContext();
                    
                    
                    if(audioContext.state === 'running') {
                            input = audioContext.createMediaStreamSource(gumStream);
                            rec = new Recorder(input, {
                                numChannels: 1
                            });
                            rec.record();
                            console.log("Recording started");
                        
                    }else if(audioContext.state === 'suspended') {
                        audioContext.resume().then(function() {                    
                            input = audioContext.createMediaStreamSource(gumStream);
                            rec = new Recorder(input, {
                                numChannels: 1
                            });
                            rec.record();
                            console.log("Recording started");
                        });  
                    }

                    
                } else {
                    alert("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
                }
                

            } catch (e) {
                console.log(e);
                alert(e);
            }
        })();
        
    }

    function stopRecording() {
        console.log("stopButton clicked");

        rec.stop();

        //stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on to createDownloadLink
        rec.exportWAV(createDownloadLink);
    }

    function getFileBase64Encode(blob) { //將語音檔從blob轉換成base64。
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(blob); //將 blob to DataURL 的部分。
            reader.onload = () => resolve(reader.result); //沒問題會跳這裡並回傳。
            reader.onerror = error => reject(error); //發生錯誤會跳這裡。

        });
    }

    function createDownloadLink(blob) {
        var au = document.createElement('audio');
        /*替換空格的提示。*/
        var regex = /\s/;
        let vocabulary = $("#word").text();
        vocabulary = vocabulary.replace(regex, '');
        au.setAttribute('id', 'audio_' + vocabulary + '_' + stop_num);
        var url = URL.createObjectURL(blob);

        /*
            URL.createObjectURL 這個很好用，以後可以直接把 objectURL 放置 <img> “src” attribute 中，
            便可預覽「上傳」的東西囉！！而且完全不會牽扯到後端，而且速度也非常的快。
            透過此方式「上傳」的 object，是放在瀏覽器的記憶體裡面
            所以當網頁離開，這些「上傳」的 objects 都會被釋放，達到清除預覽照片的效果(清除物件減少負擔)。

            但缺點就是並不能快取，僅能當下抓取當下用，但也很快就是了。
        */

        au.src = url;
        //        au.controls = true;
        getFileBase64Encode(blob).then(b64 => {
            audio_base64[stop_num] = b64;
            console.log('stop_num:'+stop_num);
            console.log('b64:'+b64);
            /* 「 b64 」是語音檔轉成base64的變數，要處理語音檔資料可以從這裡抓。*/
        });
        $('#recordingslist').append(au);
    }



});