$(function () {
    var word = ["cat", "hamster", "guinea pig", "rabbit"]; // 宣告陣列放入 4 個單字。
    var partOfSpeech = ["(n.)", "(n.)", "(n.)", "(n.)"]; // 宣告陣列放入 4 個單字詞性。
    var definition = ["貓", "倉鼠", "天竺鼠", "兔子"]; // 宣告陣列放入 4 個單字翻譯。
    var file_word = []; // 宣告陣列放入 4 個去除空格的單字，來命名檔案名稱。
    var order = []; // 宣告陣列放入排序。
    var sound = []; // 宣告陣列放入 4 個語音檔。
    let round = 0 // 表示目前階段，本關卡共有三個階段。
    let step = 0; // 表示目前階段的步驟，每階段有4個步驟。
    let move = 0; // 表示總共步驟。
    let focus_option = ""; //目前所選擇的選項。
    
    /*sweetAlert2 的功能。*/
    function dialog(situation) {
        console.log("Dialog:" + situation);
        if (situation == 0) { //開始前說明。
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
                        $('#title_en').show(1000);
                        $('#select_0,#select_1,#select_2,#select_3').fadeIn(1500);
                        $('#done').show(1500);
                        console.log("進入挑選練習。");
                    }
                });
        } else if (situation == 1) { // 答對。
            $('#sound_correct').get(0).play();
            var timeout = setTimeout(function () {
                $('#sound_' + file_word[order[step]]).get(0).play();
            }, 800);
            swal.fire({
                    icon: "success",
                    title: word[order[step]],
                    html: "<p style='font-family:support;font-size:22px;font-weight: 900;'>"+partOfSpeech[order[step]]+"&ensp;"+definition[order[step]]+"</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        console.log("在第"+round+"階段，第"+step+"步驟，答對。");
                        progress();
                        if(move < 12){
                            $('#title_en').hide(1500,function(){
                                /* 內容變化。 */
                                change_content();
                                $(this).show(1000);
                            });
                            $('#done').hide(1500);
                            $('#select_0,#select_1,#select_2,#select_3').fadeOut(1500,function(){
                                $(this).fadeIn(1500);
                                $('#done').show(1500);
                            });
                        }else{
                            dialog(4);
                        }
                        
                    }
                });
        } else if (situation == 2) { // 沒選擇選項。
            $('#sound_wrong').get(0).play();
            swal.fire({
                    icon: "warning",
                    title: "警告",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>請擇一選項符合題目。</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        console.log("在第"+round+"階段，第"+step+"步驟，沒選項。");
                    }
                });
        } else if (situation == 3) { // 答錯。
            $('#sound_wrong').get(0).play();
            var timeout = setTimeout(function () {
                $('#sound_' + file_word[order[step]]).get(0).play();
            }, 1000);
            swal.fire({
                    icon: "error",
                    title: word[order[step]],
                    html: "<p style='font-family:support;font-size:22px;font-weight: 900;'>"+partOfSpeech[order[step]]+"&ensp;"+definition[order[step]]+"</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        console.log("在第"+round+"階段，第"+step+"步驟，答錯");
                        progress();
                        if(move < 12){
                            $('#title_en').hide(1500,function(){
                                /* 內容變化。 */
                                change_content();
                                $(this).show(1000);
                            });
                            $('#done').hide(1500);
                            $('#select_0,#select_1,#select_2,#select_3').fadeOut(1500,function(){
                                $(this).fadeIn(1500);
                                $('#done').show(1500);
                            });
                        }else{
                            dialog(4);
                        }
                        
                    }
                });
        } else { // 完成挑選練習。
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
                        console.log("前往下一個訓練，Pairing");
//                        location.replace('pairing.html');
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
    function prepare() {
        console.log("round:" + round + ' / ' + "step:" + step);
        var random_option = getRandomArray(4);/*改變選項順序。*/
        
        if(round == 0){ // 第一階段。
            if(step == 0){ // 剛進來畫面，載入所需的內容，僅載入一次。
                order = getRandomArray(4);
                
                for(let k=0;k<4;k++){
                    /*去除空格。*/
                    var regex = /\s/;
                    file_word[k] = word[k].replace(regex, '');
                    
                    /*對元素創建標籤。*/
                    $('#select_'+k).attr('data-answer','');

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
                            sound[order[k]].setAttribute("id", "sound_" + file_word[order[k]]);
                            sound[order[k]].setAttribute("src", json[0].sounds[0].fileName);
                            sound[order[k]].setAttribute("preload", "auto");
                            document.body.appendChild(sound[order[k]]);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log("XMLHttpRequest:" + XMLHttpRequest);
                            console.log("textStatus:" + textStatus);
                            console.log("errorThrown:" + errorThrown);
                            console.log('error, use the plan B.');
                            sound[order[k]] = document.createElement("audio"); //創建聲音檔元件。
                            sound[order[k]].setAttribute("id", "sound_" + file_word[order[k]]);
                            sound[order[k]].setAttribute("src","word_sound/"+file_word[order[k]]+".mp3");
                            sound[order[k]].setAttribute("preload", "auto");
                            document.body.appendChild(sound[order[k]]);
                        }
                    });
                }
            }
            
            /*改變題目。*/
            $("#title_en").html("Which one is ”<span id='title_word'>"+definition[order[step]]+"</span>”&nbsp;?");
            
            /*改變選項順序。*/
            for(let k = 0 ; k < 4 ; k++ ){
                /*對元素放入標籤。*/
                $('#select_'+k).data('answer',word[random_option[k]]);
                
                $('#word_'+k).text(word[random_option[k]]); $('#img_'+k).attr('src','word_image/'+file_word[random_option[k]]+'_'+Math.floor(Math.random() * 3)+'.jpg');
                
            }
            
        }else if(round == 1){ // 第二階段。
            if(step == 0){
                order = getRandomArray(4);
            }
            /*改變題目。*/
            $("#title_en").html("Which one is ”<span id='title_word'>"+definition[order[step]]+"</span>”&nbsp;?");
            
            /*改變選項順序。*/
            for(let k = 0 ; k < 4 ; k++ ){
                /*對元素放入標籤。*/
                $('#select_'+k).data('answer',word[random_option[k]]);
                
                $('#word_'+k).html(word[random_option[k]]+"<br>"+partOfSpeech[random_option[k]]); 
                
            }
            
            
        }else{ // 第三階段。
            if(step == 0){
                order = getRandomArray(4);
            }
            /*改變題目。*/
            $("#title_en").html("Pick up the word you have listened to");
            
            /*改變選項順序。*/
            for(let k = 0 ; k < 4 ; k++ ){
                /*對元素放入標籤。*/
                $('#select_'+k).data('answer',word[random_option[k]]);
                
                $('#word_'+k).html(definition[random_option[k]]); 
                
            }
        }
        
        console.log("答案:" + word[order[step]]);
        
    }
    /*選項變化*/
    function change_content(){
        step++;
        if(step == 4){
            step = 0;
            round++;
        }
        console.log("step:"+step);
        console.log("round:"+round);
        
        /*初始化*/
        focus_option = "";
        $(".select").css('border','3px solid grey');
        $(".select").css('backgroundColor','#d3e6f9');
        
        prepare();
        
        if( round == 0 ){
        }else if( round == 1 ){
            $('.ima_bg').remove();
            
            /*以下三個屬性為文字或圖像水平、垂直置中的方法中最沒問題的寫法。*/
            $('.select').css('display','flex');
            $('.select').css('align-items','center');
            $('.select').css('justify-content','center');
            
            $('#select_0,#select_1,#select_2,#select_3').css('height','150px');
            $('#select_0,#select_1,#select_2,#select_3').css('top','310px');
            
        }else{
            $('.word').css('font-family','support');
            $('.word').css('font-weight','900');
            $('.word').css('font-size','26px');
            
        }
        
        
    }
    


    dialog(0);
    prepare();
    
    
    
    /*練習發音時，點擊聽單字發音*/
    $('#sound').on('click', function () {
        event.preventDefault();
        event.stopPropagation();
        /*播放語音*/
        play_sound();
    });
    /*點擊選項時的反饋*/
    $('.select').on('click',function(){
        event.preventDefault();
        event.stopPropagation();
        if(focus_option == $(this).attr('id')){ // 取消自身選擇。
            focus_option = "";
            $(this).css('border','3px solid grey');
            $(this).css('backgroundColor','#d3e6f9');
            
        }else{  // 其他選項變化。
            $(".select").css('border','3px solid grey');
            $(".select").css('backgroundColor','#d3e6f9');
            $(this).css('border','3px solid #c77b7b');
            $(this).css('backgroundColor','#f9d9d9');
            focus_option = $(this).attr('id');
        }
        console.log("目前選擇之ID:"+focus_option);
        console.log("目前選擇之data-answer:"+$('#'+focus_option).data('answer'));
        
    });
    /*點擊Done*/
    $('#done').on('click',function(){
        event.preventDefault();
        event.stopPropagation();
        if($('#'+focus_option).data('answer') == word[order[step]]){ // 答對。
            dialog(1);
        }else if(focus_option == ""){ //沒選擇選項回答。
            dialog(2);
        }else{ // 答錯。
            dialog(3);
        }
        
    });



});