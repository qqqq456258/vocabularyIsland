$(function(){
    let title = "Listen to the pronunciation";
    var word = ["apple", "banana", "cranberry", "honeydew"];    // 宣告陣列放入 4 個單字。
    var partOfSpeech = ["(n.)", "(n.)", "(n.)", "(n.)"];        // 宣告陣列放入 4 個單字詞性。
    var definition = ["蘋果", "香蕉", "蔓越莓", "蜜瓜"];           // 宣告陣列放入 4 個單字翻譯。
    var sound = [];         // 宣告陣列放入 4 個語音檔。
    var order = [];         // 宣告陣列放入排序。
    let listen_num = 0;     // 存放聆聽次數。
    let record_num = 0;     // 存放按擊錄音次數。
    let stop_num = 0;       // 存放按擊暫停次數。
    var audio_base64 = [];  // 存放3次語音的 base64。
    let step = 1;           // 第幾步驟。
    
    
    
    function getRandomArray(){    //隨機產生不重覆的4個數字。
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
    
    function prepare() {

        /*四個單字的順序洗牌。*/
        order = getRandomArray();

        for (var i = 0; i < 1; i++) {
            console.log("order:" + order);
            console.log("word:" + word[order[i]]);

            /*放入這次學習的單字。*/
            $("#title_en").text(title);
            $("#word").text(word[order[i]]);
            $("#part_speech").text(partOfSpeech[order[i]]);
            $("#definition").text(definition[order[i]]);
            

            /*載入聲音檔。*/
            $.ajax({
                type: "get",
                async: false, //async設定false會變成同步請求 要完成ajax後才會繼續執行
                url: "php/get_data_from_LearningChocolate.php",
                data: {
                    value: word[order[i]],
                },
                dataType: "json",
                success: function (json) {
                    //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                    console.log(json);

                    sound[order[i]] = document.createElement("audio"); //創建聲音檔元件。
                    sound[order[i]].setAttribute("id", "sound_" + word[order[i]]);
                    sound[order[i]].setAttribute("src", json[0].sounds[0].fileName);
                    sound[order[i]].setAttribute("preload", "auto");
                    document.body.appendChild(sound[order[i]]); //把它添加到頁面上。

                    //                $('#test_pic').attr('src', json[0].images[0].fileName);
                    //                $('#sound').attr('src', json[0].sounds[0].fileName);
                    //                audio = document.getElementById("test_voice");

                },
                error: function () {
                    alert('fail');
                }
            });
        }

    }
    
    prepare();
    
    
    /*點擊聽單字發音*/
    $('#sound').click(function () {
        let vocabulary = $('#word').text();
        console.log("vocabulary:" + vocabulary);
        if(listen_num == 1){
            $("#title_en").text("Record your voice 3 times");//變更標題。
        }
        
        $('#sound_' + vocabulary).get(0).play();        /*播放第一次語音*/
        
        var timeout_0 = setTimeout(function(){
            $('#sound_' + vocabulary).get(0).play();    /*播放第二次語音*/
        },2000);
        
        var timeout_1 = setTimeout(function(){
            $('#sound_' + vocabulary).get(0).play();    /*播放第三次語音*/
        },4000);

        /* css 變化 */
        $('#vocabulary').css('height','350px');//單字區塊變長。
        $('#record,#stop').css('display','inline-block');//將錄音與暫停按鈕並排。
        listen_num++;//按聲音次數。
        if(listen_num == 1){
            $("#title_en").text("Record your voice ( 0 / 3 )");//變更標題。
            $('#voice_zone').css('display','block');//錄音的結果出現。
        }

    });
    
    /*  調整錄音按鈕的顯示與隱藏、效果。 */
    $('#record').click(function () {
        $(this).attr('src', 'material/record_0.png');//錄音按鈕關閉。
        $(this).attr('disabled','disabled');//錄音按鈕關閉。
        $('#stop').attr('src', 'material/stop_1.png');//暫停按鈕開啟。
        $('#stop').removeAttr('disabled');//暫停按鈕開啟。
        record_num++;//錄音按鈕點擊次數。
    });
    
    /*  錄音結束按鈕的顯示與隱藏、效果。 */
    $('#stop').click(function () {
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
        }
    });
    
    /*  錄音結束後，點擊自己的聲音，並呈現選擇錄音的變化效果。*/
    $('.voice').click(function (){
        var audio_num = $(this).attr('id').split("_");
        console.log('Play - #audio_' + audio_num[1]);
        $('#audio_' + audio_num[1]).get(0).play();
        for(let i = 1 ; i<4 ; i++ ){
            $('#voice_zone_'+i).css('border','5px dashed gray');
        }
        $('#voice_zone_'+audio_num[1]).css('border','5px solid red');
    });
    
    /*點擊下一步。*/
    $('#next_btn').click(function(){
        step++;
        console.log("step:"+step);
        if(step == 2){
            $('#title_en').text('Spell the word in English');//變更標題。
            $('#vocabulary').css('display','none');//單字區塊隱藏。
            $("#voice_1,#voice_2,#voice_3").removeAttr('disabled');//將錄完音的按鈕解鎖。
            $("#voice_1,#voice_2,#voice_3").css('visibility','hidden');//將錄完音的按鈕隱藏。
            $('#voice_zone').css('display','none');//錄音區塊隱藏。
            $('#spell_zone').css('display','block');//拼字區塊出現。
            $('#next_btn').attr('src','material/done.png');
        }else if(step == 3){
            $('#title_en').text('Try again');//變更標題。
            $('#tip').text(''); //清空內容。
            $('#answer').val(''); //清空內容。
            $('#hint').attr('src','material/tips_again.png');//換一個暗示圖形，表示內容變更。
            $('#next_btn').attr('src','material/done.png');
        }else{
            
        }
        
    });
    
    /*即時字元檢測。*/
    $('#answer').keyup(function(){
        let vocabulary = "apple";
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
    
    
    
    window.onload=function(){
    
    URL = window.URL || window.webkitURL;

    var gumStream; 						//stream from getUserMedia()
    var rec; 							//Recorder.js object
    var input; 							//MediaStreamAudioSourceNode we'll be recording

    // shim for AudioContext when it's not avb. 
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext //audio context to help us record

    var recordButton = document.getElementById("record");
    var stopButton = document.getElementById("stop");

    //add events to those 2 buttons
    recordButton.addEventListener("click", startRecording);
    stopButton.addEventListener("click", stopRecording);

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
        au.setAttribute('id','audio_'+stop_num);
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