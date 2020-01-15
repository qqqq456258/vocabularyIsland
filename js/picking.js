$(function () {
    var word = ["cat", "hamster", "guinea pig", "rabbit"]; // 宣告陣列放入 4 個單字。
    var partOfSpeech = ["(n.)", "(n.)", "(n.)", "(n.)"]; // 宣告陣列放入 4 個單字詞性。
    var definition = ["貓", "倉鼠", "天竺鼠", "兔子"]; // 宣告陣列放入 4 個單字翻譯。
    var order = []; // 宣告陣列放入排序。
    var sound = []; // 宣告陣列放入 4 個語音檔。
    let round = 0; // 控制下一個單字出現。
    let move = 0; // 基礎練習總共步驟。
    
    
    /*sweetAlert2 的功能。*/
    function dialog(situation) {
        console.log("Dialog:" + situation);
        if (situation == 0) { //遊戲開始前說明。
            swal.fire({
                    icon: "info",
                    title: "Picking",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;padding-left: 10px;'>從下方四個選項中，選出<b>符合題目</b>的選項。</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: " O K "
                })
                .then((result) => {
                    if (result.value) {
                        show_option();
                        console.log("進入挑選練習。");
                    }
                });
        } else if (situation == 1) { // 未挑選單字發音的提示。
            $('#sound_wrong').get(0).play();
            swal.fire({
                    icon: "error",
                    title: "Error",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>請將三個錄音與標準發音比較，<br><b>挑出一個最滿意的</b>。</p>",
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
                        console.log("在 Step 3 使用提示。");
                    }
                });
        } else if (situation == 4) { // 完成後給的存檔回應。
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
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>恭喜完成基礎練習！！</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        console.log("前往下一個訓練，Picking");
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
        $('#sound_' + vocabulary).get(0).play(); /*播放第一次語音*/
    }
    /*初始化*/
    function init_content() { //here
        round++; //下一個。

//            $('#sound').off('click');
//            $('#spell_sound').off('click');
//            $('#record').off('click');
//            $('#stop').off('click');
//            $('.voice').off('click');
//            $('#next_btn').off('click');
//            $('#hint').off('click');

        console.log("初始化");

    }
    /*隨機產生不重覆的4個數字。*/
    function getRandomArray(num) {
        var rdmArray = [num]; //儲存產生的陣列。

        for (var i = 0; i < num; i++) {
            var rdm = 0; //暫存的亂數。

            do {
                var exist = false; //此亂數是否已存在。
                rdm = Math.floor(Math.random() * num); //取得亂數

                //檢查亂數是否存在於陣列中，若存在則繼續回圈。
                if (rdmArray.indexOf(rdm) != -1) exist = true;

            } while (exist); //產生沒出現過的亂數時離開迴圈。

            rdmArray[i] = rdm;
        }
        return rdmArray;
    }
    /*進度條*/
    function progress() {
        let total_move = 12;
        move++;
        percentage = Math.floor(move / 12 * 100);
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
    /*四個單字的順序洗牌。*/
    function prepare(round) {
        let i = round;
        console.log("order:" + order);
        console.log("word:" + word[order[i]]);
        console.log("round:" + round);
        order = getRandomArray(4);
        var random_option = getRandomArray(4);
        
        if(i == 0){ //中英文、圖片、語音 的階段。
            /*放入這次學習的單字。*/
            $("#title_en").html("Which one is ”<span id='title_word'>"+definition[order[i]]+"</span>”&nbsp;?");
            for(let k = 0 ; k < 4 ; k++ ){

                /*替換空格的提示。*/
                var regex = /\s/;
                let vocabulary = word[order[k]];
                vocabulary = vocabulary.replace(regex, '');
                
                $('#word_'+k).text(word[random_option[k]]); $('#img_'+k).attr('src','word_image/'+vocabulary+'_'+Math.floor(Math.random() * 3)+'.jpg');
                
                /*載入聲音檔。*/
                $.ajax({
                    type: "get",
                    async: true, //async設定true會變成異步請求。
                    cache: true,
                    url: "php/get_data_from_LearningChocolate.php",
                    data: {
                        value: word[order[k]],
                    },
                    dataType: "json",
                    success: function (json) {
                        //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                        console.log(json);

                        sound[order[k]] = document.createElement("audio"); //創建聲音檔元件。
                        sound[order[k]].setAttribute("id", "sound_" + vocabulary);
                        sound[order[k]].setAttribute("src", json[0].sounds[0].fileName);
                        sound[order[k]].setAttribute("preload", "auto");
                        document.body.appendChild(sound[order[k]]);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log("XMLHttpRequest:" + XMLHttpRequest);
                        console.log("textStatus:" + textStatus);
                        console.log("errorThrown:" + errorThrown);
                        alert("異常！");
                    }
                });
            }
            
        }else if(i == 1){ //中英文、語音 的階段。
            
        }else{ //中英文的階段。
            
        }
        
        
    }
    /*選項出現*/
    function show_option(){
        $('#select_0,#select_1,#select_2,#select_3').fadeIn(1500);
    }
    /*選項隱藏*/
    function hide_option(){
        $('#select_0,#select_1,#select_2,#select_3').fadeOut(1500);
    }

    dialog(0);
    prepare(round);
    
    
    
    /*練習發音時，點擊聽單字發音*/
    $('#sound').on('click', function () {
        event.preventDefault();
        event.stopPropagation();
        /*播放語音*/
        play_sound();
    });
    
    /*點擊選項時的反饋*/
    $('.select').on('click',function(){
        $(this).css('border','3px solid #c77b7b');
        $(this).css('backgroundColor','#f9d9d9');
        
        
        
        /*記得寫判斷其他選項變回去的方法*/
        
        
        
    });



});