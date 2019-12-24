
$(function () {
    var word = ["cat", "hamster", "guinea pig", "rabbit"];// 宣告陣列放入 4 個單字。
    var partOfSpeech = ["(n.)", "(n.)", "(n.)", "(n.)"];// 宣告陣列放入 4 個單字詞性。
    var definition = ["貓", "倉鼠", "天竺鼠", "兔子"];// 宣告陣列放入 4 個單字翻譯。
    var sound = []; // 宣告陣列放入 4 個語音檔。
    var pass_tag = [1, 1, 0, 0]; // 宣告陣列放入 4 個過關參數。
    var level_round = 2;
    function back() {
    alert("返回功能。")
}
    function prepare(){ 
        for (var i = 0; i < 4; i++) { 
            // 單字放入陣列。
            
            //畫面放入圖片、單字及翻譯。
            $("#word_name_"+(i+1)).text(word[i]);
            $("#word_partOfSpeech_"+(i+1)).text(partOfSpeech[i]);
            $("#word_definition_"+(i+1)).text(definition[i]);
            $("#word_picture_"+(i+1)).attr('src','word_image/'+word[i]+'.png');
            
            // 放入聲音檔。
            sound[i] = document.createElement("audio");
            var sentence = 'word_sound/' + $('#word_name_' + (i + 1)).text() + '.mp3';
            sound[i].setAttribute("src", sentence);
            console.log(sound[i]);
        }
        
        
    }
    function button_set(){  //設定練習按鈕的開關。
        for (var j = 0; j < 4; j++) {
            switch (j) {
                case 0:
                    $("#pronouncing").attr('src', 'material/pronouncing_' + level_round + '_'+pass_tag[j]+'.png');
                    break;
                case 1:
                    $("#pairingGame").attr('src', 'material/pairingGame_' + level_round + '_'+pass_tag[j]+'.png');
                    break;
                case 2:
                    $("#fillingGame").attr('src', 'material/fillingGame_' + level_round + '_'+pass_tag[j]+'.png');
                    break;
                default:
                    $("#dictatingGame").attr('src', 'material/dictatingGame_' + level_round + '_'+pass_tag[j]+'.png');
                    break;
            }
        }
        if (pass_tag[0] == 0 && pass_tag[1] == 0 && pass_tag[2] == 0 && pass_tag[3] == 0) {
            $("#makeFlahscard").attr('src', 'material/makeFlahscard_1.png');
            $("#makeFlahscard").removeAttr('disabled');
        }
    }
    function Pick_exam_message(situation) {
        if(situation == 0){     // 【發音練習】
            swal({
                    title: "【發音練習】",
                    text: "初步認識 4 個單字，並試著一個個念出單字發音。",
                    icon: "info",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: [true, "Play !!"]  //客製化按鈕。
                })
                .then((result) => {
                    if(result){
                        window.location.href = "pronouncing.html";
                    }
                });
        }else if(situation == 1){     // 機會次數用完，遊戲失敗。
            swal({
                    title: "【配對遊戲】",
                    text: "點擊圖片、文字播放發音，完成圖片與文字的配對，限時 60 秒。",
                    icon: "info",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: ["true", "Play !!"],  //客製化按鈕。
                    dangerMode: true
                })
                .then((result) => {
                    if(result){
                        window.location.href = "pairingGame.html";
                    }
                });
        }else if(situation == 2){     // 機會次數用完，遊戲失敗。
            swal({
                    title: "【填空遊戲】",
                    text: "播放單字的語音，學生依序點擊填入答案，限時 40 秒/字。",
                    icon: "info",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: ["true", "Play !!"],  //客製化按鈕。
                    dangerMode: true
                })
                .then((result) => {
                    if(result){
                        location.reload();
//                        window.location.href = "pairingGame.html";
                    }
                });
        }else if(situation == 3){     // 機會次數用完，遊戲失敗。
            swal({
                    title: "【聽寫遊戲】",
                    text: "播放單字的語音，學生打字填入答案，限時 45 秒/字。",
                    icon: "info",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: ["true", "Play !!"],  //客製化按鈕。
                    dangerMode: true
                })
                .then((result) => {
                    if(result){
                        location.reload();
//                        window.location.href = "pairingGame.html";
                    }
                });
        }
    }
    
    prepare();
    button_set();
    
    $("#pairingGame").on('click',function(){
        Pick_exam_message(1);
    });
    
    $(".sound").click(function () { // 按下聲音圖案，播放相對應的語音。
        var ID = $(this).attr("id");
        var which = ID.split("_");
        console.log(which[2]);
        sound[which[2] - 1].play();
    });
    $
    /*記得寫 找遊玩紀錄中的過關紀錄。*/

});