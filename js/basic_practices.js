$(function(){
    let title = "Listen to the pronunciation";
    var word = ["apple", "banana", "cranberry", "honeydew"];// 宣告陣列放入 4 個單字。
    var partOfSpeech = ["(n.)", "(n.)", "(n.)", "(n.)"];// 宣告陣列放入 4 個單字詞性。
    var definition = ["蘋果", "香蕉", "蔓越莓", "蜜瓜"];// 宣告陣列放入 4 個單字翻譯。
    var sound = []; // 宣告陣列放入 4 個語音檔。
    var order = []; // 宣告陣列放入排序。
    
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
    $('#sound').on('click', function () {
        let vocabulary = $('#word').text();
        console.log("vocabulary:" + vocabulary);
        
        $('#sound_' + vocabulary).get(0).play();        /*播放第一次語音*/
        
        var timeout_0 = setTimeout(function(){
            $('#sound_' + vocabulary).get(0).play();    /*播放第二次語音*/
        },2500);
        
        var timeout_1 = setTimeout(function(){
            $('#sound_' + vocabulary).get(0).play();    /*播放第三次語音*/
        },5000);

        /* css 變化 */
        $('#vocabulary').css('height','350px');
        $('#record,#stop').css('display','inline-block');

    });
    
    /*  調整錄音按鈕的顯示與隱藏。 */
    $('#record').click(function () {
        $(this).attr('src', 'material/record_0.png');
        $(this).attr('disabled','disabled');
        $('#stop').attr('src', 'material/stop_1.png');
        $('#stop').removeAttr('disabled');
    });
    $('#stop').click(function () {
        $(this).attr('src', 'material/stop_0.png');
        $(this).attr('disabled','disabled');
        $('#record').attr('src', 'material/record_1.png');
        $('#record').removeAttr('disabled');
    });


    
//    window.onload=function(){
//    
//    URL = window.URL || window.webkitURL;
//
//    var gumStream; 						//stream from getUserMedia()
//    var rec; 							//Recorder.js object
//    var input; 							//MediaStreamAudioSourceNode we'll be recording
//
//    // shim for AudioContext when it's not avb. 
//    var AudioContext = window.AudioContext || window.webkitAudioContext;
//    var audioContext //audio context to help us record
//
//    var recordButton = document.getElementById("recordButton");
//    var pauseButton = document.getElementById("pauseButton");
//    var stopButton = document.getElementById("stopButton");
//
//    //add events to those 2 buttons
//    recordButton.addEventListener("click", startRecording);
//    stopButton.addEventListener("click", stopRecording);
//    pauseButton.addEventListener("click", pauseRecording);
//
//}
//    //webkitURL is deprecated but nevertheless
//
//    function startRecording() {
//        console.log("recordButton clicked");
//
//        var constraints = { audio: true, video:false }
//
//        /*
//            Disable the record button until we get a success or fail from getUserMedia() 
//        */
//
//        recordButton.disabled = true;
//        stopButton.disabled = false;
//        pauseButton.disabled = false;
//        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
//        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
//
//            /*
//                create an audio context after getUserMedia is called
//                sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
//                the sampleRate defaults to the one set in your OS for your playback device
//            */
//        audioContext = new AudioContext();
//        gumStream = stream;
//
//            /* use the stream */
//        input = audioContext.createMediaStreamSource(stream);
//
//            /* 
//                Create the Recorder object and configure to record mono sound (1 channel)
//                Recording 2 channels  will double the file size
//            */
//        rec = new Recorder(input,{numChannels:1});
//            //
//
//            //start the recording process
//        rec.record();
//        console.log("Recording started");
//
//        }).catch(function(err) {
//            console.log(err);
//            //enable the record button if getUserMedia() fails
//            recordButton.disabled = false;
//            stopButton.disabled = true;
//            pauseButton.disabled = true;
//        });
//    }
//    function pauseRecording(){
//        console.log("pauseButton clicked rec.recording=",rec.recording );
//        if (rec.recording){
//            //pause
//            rec.stop();
//            pauseButton.innerHTML="Resume";
//        }else{
//            //resume
//            rec.record()
//            pauseButton.innerHTML="Pause";
//
//        }
//    }
//    function stopRecording() {
//        console.log("stopButton clicked");
//
//        //disable the stop button, enable the record too allow for new recordings
//        stopButton.disabled = true;
//        recordButton.disabled = true;
//        pauseButton.disabled = true;
//
//        //reset button just in case the recording is stopped while paused
//        pauseButton.innerHTML="Pause";
//
//        //tell the recorder to stop the recording
//        rec.stop();
//
//        //stop microphone access
//        gumStream.getAudioTracks()[0].stop();
//
//        //create the wav blob and pass it on to createDownloadLink
//        rec.exportWAV(createDownloadLink);
//    }
//
//    function getFileBase64Encode(blob) {        //將語音檔從blob轉換成base64。
//      return new Promise((resolve, reject) => {
//        const reader = new FileReader();
//
//        reader.readAsDataURL(blob);     //將 blob to DataURL 的部分。
//        reader.onload = () => resolve(reader.result); //沒問題會跳這裡並回傳。
//        reader.onerror = error => reject(error); //發生錯誤會跳這裡。
//      });
//    }
//    function createDownloadLink(blob) {
//
//        $('#record_div').html("<div style='margin-top:30px;'><span id='recordingslist'></span><input type='image' id='confirm' src='material/confirm.gif'></div>");
//            //<b style='font-size: 48px;font-weight: 700;color:green;'>&ensp;✔</b><br>
//        var au = document.createElement('audio');
//        var url = URL.createObjectURL(blob);  
//        /*
//            URL.createObjectURL 這個很好用，以後可以直接把 objectURL 放置 <img> “src” attribute 中，便可預覽「上傳」的東西囉！！
//            而且完全不會牽扯到後端，而且速度也非常的快。
//            透過此方式「上傳」的 object，是放在瀏覽器的記憶體裡面
//            所以當網頁離開，這些「上傳」的 objects 都會被釋放，達到清除預覽照片的效果(清除物件減少負擔)。
//
//            但缺點就是並不能快取，僅能當下抓取當下用，但也很快就是了。
//        */
//
//        au.src = url;
//        au.controls = true;
//        getFileBase64Encode(blob).then(b64 =>{
//            Audio_dataURL = b64;
//            console.log("Audio:"+Audio_dataURL);
//            /* 「 b64 」是語音檔轉成base64的變數，要處理語音檔資料可以從這裡抓。*/
//        });
//        voice_determined = 1;
//        $('#recordingslist').append(au);
//    }

    

//    
//    /*點擊下一步*/
//    $('#next_step').on('click',function(){
//        $('.container,#react_btn').hide(1000,);
//    });
//    


});