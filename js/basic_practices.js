$(function(){
    var word = ["cat", "hamster", "guinea pig", "rabbit"];    // 宣告陣列放入 4 個單字。
    var partOfSpeech = ["(n.)", "(n.)", "(n.)", "(n.)"];        // 宣告陣列放入 4 個單字詞性。
    var definition = ["貓", "倉鼠", "天竺鼠", "兔子"];           // 宣告陣列放入 4 個單字翻譯。
    let hint = "";          // 存放去除字母的提示部分。
    var order = [];         // 宣告陣列放入排序。
    var sound = [];         // 宣告陣列放入 4 個語音檔。
    let listen_num = 0;     // 存放聆聽次數。
    let record_num = 0;     // 存放按擊錄音次數。
    let stop_num = 0;       // 存放按擊暫停次數。
    let choose_audio = "";  // 存放三個錄音中所選擇的audio ID，可以再去 audio_base64 陣列中找 base64。
    var audio_base64 = [];  // 存放3次語音的 base64。
    let step = 1;           // 控制步驟的參數。
    let round = 0;          // 控制下一個單字出現。
    let move = 0;     // 基礎練習總共步驟。
    
         /*sweetAlert2 的功能。*/
    function dialog(situation){
        console.log("Dialog:"+situation);
        if(situation == 0){ //遊戲開始前說明。
            swal.fire({         
                    icon: "info",
                    title: "Basic Practice",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;text-align: left;padding-left: 10px;'>1. 試著練習發音<b>三次</b>。<br>2. 與標準發音比較，<b>挑出最滿意的錄音結果</b>。<br>3. 最後，試著聆聽發音並<b>拼出</b>單字。</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText:" O K "
                })
                .then((result) => {
                    if(result.value){
                        console.log("進入基礎練習。");
                    }
                });
        }else if(situation == 1){ // 未挑選單字發音的提示。
            $('#sound_wrong').get(0).play();
            swal.fire({         
                    icon: "error",
                    title: "Error",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>請將三個錄音與標準發音比較，<br><b>挑出一個最滿意的</b>。</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText:"O K"
                })
                .then((result) => {
                    if(result.value){
                        console.log("忘記挑選錄音。");
                    }
                });
        }else if(situation == 2){ // STEP 2 的提示。
            swal.fire({
                    title: $("#word").text(),
                    html: "<p style='font-family:support;font-size:22px;font-weight: 900;'>"+$("#part_speech").text()+" "+$("#definition").text()+"</p>",
                    imageUrl:'material/animat-pencil-color.gif',
                    imageWidth: 64,
                    imageHeight: 64,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText:"O K"
                })
                .then((result) => {
                    if(result.value){
                        console.log("在 Step 2 使用提示。");
                    }
                });
        }else if(situation == 3){ // STEP 3 的提示。
            swal.fire({
                    title: hint,
                    html: "<p style='font-family:support;font-size:22px;font-weight: 900;'>"+$("#part_speech").text()+" "+$("#definition").text()+"</p>",
                    imageUrl:'material/animat-pencil-color.gif',
                    imageWidth: 64,
                    imageHeight: 64,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText:"O K"
                })
                .then((result) => {
                    if(result.value){
                        console.log("在 Step 3 使用提示。");
                    }
                });
        }else if(situation == 4){ // 完成後給的存檔回應。
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 700
            })
        }else if(situation == 5){ // 完成基礎練習。
            swal.fire({         
                    icon: "success",
                    title: "完成",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>恭喜完成基礎練習！！</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText:"O K"
                })
                .then((result) => {
                    if(result.value){
                        console.log("前往下一個訓練，Picking");
                    }
                });
        }else{//STEP 2,3 的結果提示。 
            let icon = "";
            if($('#tip').text() == "Correct."){
                $('#sound_correct').get(0).play();  //播放正確音效。
                icon = "success";
                console.log("Correct");
            }else{
                $('#sound_wrong').get(0).play();
                icon = "error";
                console.log("Wrong");
            }
            swal.fire({
                    icon: icon,
                    title: $("#word").text(),
                    html: "<p style='font-family:support;font-size:22px;font-weight: 900;'>"+$("#part_speech").text()+" "+$("#definition").text()+"</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText:"O K"
                })
                .then((result) => {
                    if(result.value){
                        if(step == 3){
                            /*播放語音*/
                            play_sound();
                            progress();
                        }else{
                            progress();
                            if(move < 20){
                                init_content();//初始化。
                                prepare(round);//載入單字。
                            }else{
                                dialog(5);
                            }
                        }
                    }
                });
        } 
    }
    
        /*播放語音*/
    function play_sound() {
        /*替換空格的提示。*/
        var regex = /\s/;
        let vocabulary = $("#word").text();
        vocabulary = vocabulary.replace(regex, '');
        
        var timeout_0 = setTimeout(function () {
            $('#sound_' + vocabulary).get(0).play(); /*播放第一次語音*/
        }, 1000);

        var timeout_1 = setTimeout(function () {
            $('#sound_' + vocabulary).get(0).play(); /*播放第二次語音*/
        }, 2600);

        var timeout_2 = setTimeout(function () {
            $('#sound_' + vocabulary).get(0).play(); /*播放第三次語音*/
        }, 4200);
    }
        /*初始化*/
    function init_content() { //here
        round++; //下一個。
        step = 1;
        listen_num = 0;
        record_num = 0;
        stop_num = 0;
        $('#tip').text(''); //清空內容。
        $('#answer').val(''); //清空內容。
        $('#answer').removeAttr('placeholder');
        $('#hint').attr('src', 'material/tips.png'); //換暗示圖形，表示內容變更。
        $('#next_btn').attr('src', 'material/next_step.png'); //換下一步的按鈕。
        $('#spell_zone').css('display','none');
        $('#click_zone').css('display','none');
        
        $('#vocabulary').css('marginTop','90px');
        $('#vocabulary').css('display','block');
        $('#record,#stop').css('display','none');
        choose_audio = "";
        for(let i = 1 ; i<4 ; i++ ){
            $('#voice_zone_'+i).css('border','5px dashed gray');
        }
        
        console.log("初始化");
        
    }
    
        /*隨機產生不重覆的4個數字。*/
    function getRandomArray(){
        var rdmArray = [4];     //儲存產生的陣列。

        for(var i=0; i<4; i++) {
            var rdm = 0;        //暫存的亂數。

            do {
                var exist = false;          //此亂數是否已存在。
                rdm = Math.floor(Math.random()*4);    //取得亂數

                //檢查亂數是否存在於陣列中，若存在則繼續回圈。
                if(rdmArray.indexOf(rdm) != -1) exist = true;

            } while (exist);    //產生沒出現過的亂數時離開迴圈。

            rdmArray[i] = rdm;
         }
        return rdmArray;
    }
        
        /*進度條*/
    function progress(){
        let total_move = 20;
        move++;
        percentage = Math.floor(move/20*100);
        if (percentage < 25) {
            $('#progress_bar').css('backgroundColor', '#5C9DFF');
        } else if (percentage >= 25 && percentage < 50) {
            $('#progress_bar').css('backgroundColor', '#58E8D3');
        } else if (percentage >= 50 && percentage < 75) {
            $('#progress_bar').css('backgroundColor', '#6EFF77');
        } else if (percentage >= 75 && percentage < 100) {
            $('#progress_bar').css('backgroundColor', '#FFCA5F');
        }else{
            $('#progress_bar').css('backgroundColor', '#E73F32');
        }
        $('#progress_bar').css('width',percentage+'%');
        console.log("百分比："+percentage+"%");
        console.log("總共："+move+"步。");
    }
    
        /*四個單字的順序洗牌。*/
    function prepare(round) {
        let i = round;
        console.log("order:" + order);
        console.log("word:" + word[order[i]]);
        console.log("round:" + round);

        /*放入這次學習的單字。*/
        $("#title_en").text("Listen to the pronunciation");
        $("#word").text(word[order[i]]);
        $("#part_speech").text(partOfSpeech[order[i]]);
        $("#definition").text(definition[order[i]]);

        /*去除母音字母的提示。*/
        var regex = /[^aeiouAEIOU]/gi;
        let vocabulary = $("#word").text();
        hint = vocabulary.replace(regex, ' _ ');


        /*載入聲音檔。*/
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
                console.log(json);
                
                /*替換空格的提示。*/
                var regex = /\s/;
                let vocabulary = $("#word").text();
                vocabulary = vocabulary.replace(regex, '');

                sound[order[i]] = document.createElement("audio"); //創建聲音檔元件。
                sound[order[i]].setAttribute("id", "sound_" + vocabulary);//問題點
                sound[order[i]].setAttribute("src", json[0].sounds[0].fileName);
                sound[order[i]].setAttribute("preload", "auto");
                document.body.appendChild(sound[order[i]]); //把它添加到頁面上。
                
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:"+XMLHttpRequest);
                console.log("textStatus:"+textStatus);
                console.log("errorThrown:"+errorThrown);
                alert("異常！");  
            }
        });
    }
    
    
    dialog(0);
    order = getRandomArray(); // 重新排序。
    prepare(round); // round = 0;
    
    
    /*練習發音時，點擊聽單字發音*/
    $('#sound').click(function () {
        
        /*播放語音*/
        play_sound();
        
        if(listen_num == 0){    //僅有第一次點擊才變化。
            $("#title_en").text("Record your voice ( 0 / 3 )");//變更標題。
            $('#vocabulary').css('height','350px');//單字區塊變長。
            $('#record,#stop').css('display','inline-block');//將錄音與暫停按鈕並排。
            $('#voice_zone').css('display','block');//錄音的結果出現。
            listen_num++;
            progress();
        }
        
    });
    
    
    /*練習拼字時，點擊聽單字發音*/
    $('#spell_sound').click(function(){
        /*播放語音*/
        play_sound();
    });
    
    
    /*  調整錄音按鈕的顯示與隱藏、效果。 */
    $('#record').click(function () {
        startRecording();
        $(this).attr('src', 'material/record_0.png');//錄音按鈕關閉。
        $(this).attr('disabled','disabled');//錄音按鈕關閉。
        $('#stop').attr('src', 'material/stop_1.png');//暫停按鈕開啟。
        $('#stop').removeAttr('disabled');//暫停按鈕開啟。
        record_num++;//錄音按鈕點擊次數。
    });
    
    
    /*  錄音結束按鈕的顯示與隱藏、效果。 */
    $('#stop').click(function () {
        stopRecording();
        $(this).attr('src', 'material/stop_0.png');//暫停按鈕關閉。
        $(this).attr('disabled','disabled');//暫停按鈕關閉。
        $('#record').attr('src', 'material/record_1.png');//錄音按鈕開啟。
        $('#record').removeAttr('disabled');//錄音按鈕開啟。
        stop_num++;//暫停按鈕點擊次數。
        if(stop_num > 0 && stop_num < 3){ // 第1~2次 錄音。
            $("#title_en").text("Record your voice ( "+stop_num+" / 3 )");
            $("#voice_"+stop_num).css('visibility','visible');//錄完音的結果出現。
            $("#voice_"+stop_num).attr('disabled','disabled');//將錄完音的結果鎖起來，不給播放。
        }else{  //第3次錄音&之後。
            $("#voice_"+stop_num).css('visibility','visible');//錄完音的結果出現。
            $("#voice_1,#voice_2,#voice_3,#next_btn").removeAttr('disabled');//將錄完音的結果都解鎖。
            $('#stop,#record').css('display','none');//隱藏錄音及暫停按鈕。
            $('#vocabulary').css('height','250px');//隱藏單字區塊。
            $('#vocabulary').css('marginTop','70px');//往上調整單字區塊位置。
            $("#title_en").text("Listen and pick the best one");//變更標題。
            $('#click_zone').css('display','block');
            progress();
        }
    });
    
    /*  錄音結束後，點擊自己的聲音，並呈現選擇錄音的變化效果。*/
    $('.voice').click(function (){
        var audio_num = $(this).attr('id').split("_");
        /*替換空格的提示。*/
        var regex = /\s/;
        let vocabulary = $("#word").text();
        vocabulary = vocabulary.replace(regex, '');
        
        choose_audio = 'audio_'+vocabulary+'_'+audio_num[1]; // 選擇錄音的對象。
        console.log('Play - #' + choose_audio);
        $('#' + choose_audio).get(0).play();
        for(let i = 1 ; i<4 ; i++ ){
            $('#voice_zone_'+i).css('border','5px dashed gray');
        }
        $('#voice_zone_'+audio_num[1]).css('border','5px solid red');
        
    });
    
    
    /*點擊下一步。*/
    $('#next_btn').click(function(){
        step++;
        if(choose_audio.length == 0){ //忘了挑選錄音。
            step--;
            dialog(1);
            
        }else if(step == 2){
            dialog(4);
            $('#title_en').text('Spell the word in English');//變更標題。
            $('#vocabulary').css('display','none');//單字區塊隱藏。
            $("#voice_1,#voice_2,#voice_3").removeAttr('disabled');//將錄完音的按鈕解鎖。
            $("#voice_1,#voice_2,#voice_3").css('visibility','hidden');//將錄完音的按鈕隱藏。
            $('#voice_zone').css('display','none');//錄音區塊隱藏。
            $('#answer').attr('placeholder', hint);//幫助學生拼字。
            $('#spell_zone').css('display','block');//拼字區塊出現。
            $('#next_btn').attr('src','material/done.png');
            /*播放語音*/
            play_sound();
            progress();
            
        }else if(step == 3){
            dialog(2020);
            $('#title_en').text('Try again');//變更標題。
            $('#tip').text(''); //清空內容。
            $('#answer').val(''); //清空內容。
            
            /*去所有字母的提示。*/
            var regex = /[a-zA-Z]/gi;
            let vocabulary = $("#word").text();
            let vocabulary_length = vocabulary.replace(regex, ' _ ');
            
            $('#answer').attr('placeholder', vocabulary_length);//幫助學生拼字。
            $('#hint').attr('src','material/tips_again.png');//換一個暗示圖形，表示內容變更。
            $('#next_btn').attr('src','material/done.png');
            
        }else{
            dialog(2020);
            console.log("下一個單字。");
        }
        
    });
    
    /*即時字元檢測。*/
    $('#answer').keyup(function(){
        let vocabulary = $('#word').text();
        let input_value = $(this).val();
        console.log('vocabulary:'+vocabulary);
        console.log('input_value:'+input_value);
        console.log('length:'+input_value.length);
        

        if(vocabulary == input_value){        //完全正確。
            $('#tip').css('color','green');
            $('#tip').text("Correct.");
        }else if(vocabulary.substring(0,input_value.length) == input_value){        //往正確的道路邁進。
            $('#tip').css('color','#F9950D');
            $('#tip').text("Keep going, "+(vocabulary.length-input_value.length)+" letters left.");
        }else{        //完全錯誤。
            $('#tip').css('color','#DB0000');
            $('#tip').text("Wrong.");
        }
    });
    
    /*點擊暗示按鈕時。*/
    $('#hint').click(function(){
        if($(this).attr('src') == "material/tips.png"){
            dialog(2);
        }else{
            dialog(3);
        }
    })
    
    
    window.onload=function(){
    
    URL = window.URL || window.webkitURL;

    var gumStream; 						//stream from getUserMedia()
    var rec; 							//Recorder.js object
    var input; 							//MediaStreamAudioSourceNode we'll be recording

    // shim for AudioContext when it's not avb. 
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext //audio context to help us record
    
    navigator.permissions.query({name:'microphone'}).then(function(result) {
      if (result.state == 'granted') {
          
      } else if (result.state == 'prompt') {
          navigator.permissions.query({name:'microphone'});
      } else if (result.state == 'denied') {
          navigator.permissions.query({name:'microphone'});
      }
      result.onchange = function() {

      };
    });

//    var recordButton = document.getElementById("record");
//    var stopButton = document.getElementById("stop");

//    //add events to those 2 buttons
//    recordButton.addEventListener("click", startRecording);
//    stopButton.addEventListener("click", stopRecording);

}
    //webkitURL is deprecated but nevertheless

    function startRecording() {
        console.log("recordButton clicked");

        var constraints = { audio: true, video:false }

        /*
            Disable the record button until we get a success or fail from getUserMedia() 
        */

//        recordButton.disabled = true;
//        stopButton.disabled = false;
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

            /*
                create an audio context after getUserMedia is called
                sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
                the sampleRate defaults to the one set in your OS for your playback device
            */
            
        audioContext = new AudioContext();
        gumStream = stream;

            /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

            /* 
                Create the Recorder object and configure to record mono sound (1 channel)
                Recording 2 channels  will double the file size
            */
        rec = new Recorder(input,{numChannels:1});
            //

            //start the recording process
        rec.record();
        console.log("Recording started");

        }).catch(function(err) {
            console.log(err);
            //enable the record button if getUserMedia() fails
//            recordButton.disabled = false;
//            stopButton.disabled = true;
        });
    }
    function pauseRecording(){
        console.log("pauseButton clicked rec.recording=",rec.recording );
        if (rec.recording){
            //pause
            rec.stop();
//            pauseButton.innerHTML="Resume";
        }else{
            //resume
            rec.record()
//            pauseButton.innerHTML="Pause";

        }
    }
    function stopRecording() {
        console.log("stopButton clicked");

        //disable the stop button, enable the record too allow for new recordings
//        stopButton.disabled = true;
//        recordButton.disabled = true;
//        pauseButton.disabled = true;

        //reset button just in case the recording is stopped while paused
//        pauseButton.innerHTML="Pause";

        //tell the recorder to stop the recording
        rec.stop();

        //stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on to createDownloadLink
        rec.exportWAV(createDownloadLink);
    }

    function getFileBase64Encode(blob) {        //將語音檔從blob轉換成base64。
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
          
        reader.readAsDataURL(blob);     //將 blob to DataURL 的部分。
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
        au.setAttribute('id','audio_'+vocabulary+'_'+stop_num);
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
        getFileBase64Encode(blob).then(b64 =>{
            audio_base64[stop_num] = b64;
            console.log(b64);
            /* 「 b64 」是語音檔轉成base64的變數，要處理語音檔資料可以從這裡抓。*/
        });
        $('#recordingslist').append(au);
    }



});