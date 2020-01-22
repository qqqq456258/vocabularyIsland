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
    

    //產生不同顏色的div方格當作調色盤選項
    var colors = "red;#ab0000;#da7f01;yellow;#7fccab;darkgreen;#61b9ff;#0059a0;#9155fb;#b7b7b7;white;black".split(';');
    var sb = [];
    $.each(colors, function (i, v) {
        if(i%4 == 0 == i>0){
            sb.push("<br>");
        }
        sb.push("<div class='option' style='background-color:" + v + "'></div>");
    });
    $("#palette").html(sb.join("\n"));
    //產生不同尺寸的方格當作線條粗細選項
    sb = [];
    for (var i = 8; i <= 15; i++){
        if(i%4 == 0 == i>0){
            sb.push("<br>");
        }
        sb.push("<div class='option lw'>" + "<div style='width:%px;height:%px'></div></div>".replace(/%/g, i).replace(/#/g, 10 - i / 2));
        
    }

    $("#line").html(sb.join('\n'));
    var clrs = $("#palette .option");
    var lws = $("#line .option");
    //點選調色盤時切換焦點並取得顏色存入p_color，
    //同時變更線條粗細選項的方格的顏色
    clrs.on('click', function () {
        clrs.removeClass("active");
        $(this).addClass("active");
        p_color = this.style.backgroundColor;
        lws.children("div").css("background-color", p_color);
    }).first().click();
    //點選線條粗細選項時切換焦點並取得寬度存入p_width
    lws.on('click', function () {
        lws.removeClass("active");
        $(this).addClass("active");
        p_width =
            $(this).children("div").css("width").replace("px", "");

    }).eq(3).click();

    //取得canvas context
    var canvas = $('#canvas_draw');
    var ctx = canvas.get(0).getContext("2d");
    //ctx 屬性。
    ctx.fillStyle = "white"; //整個canvas塗上白色背景避免PNG的透明底色效果
    ctx.fillRect(0, 0, canvas.width(), canvas.height()); //Canvas 2D API 绘制填充矩形的方法。
    ctx.lineCap = "round"; //圓滑軌跡。

    /*辨別是手指或是滑鼠，而決定何種事件。*/
    const clickEvent_start = (function () {
        if ('ontouchstart' in document.documentElement === true)
            return 'touchstart';
        else
            return 'mousedown';
    })();
    const clickEvent_move = (function () {
        if ('ontouchmove' in document.documentElement === true)
            return 'touchmove';
        else
            return 'mouseover';
    })();
    const clickEvent_end = (function () {
        if ('ontouchend' in document.documentElement === true)
            return 'touchend';
        else
            return 'mouseup';
    })();
    
    /*用事件綁定，繪出畫筆軌跡*/
    var drawMode = false;
    canvas.on(clickEvent_start,function (e) {
            ctx.beginPath();
            ctx.strokeStyle = p_color;
            ctx.lineWidth = p_width;
            ctx.touch = e.targetTouches[0];
//            ctx.moveTo(e.changedTouches[0].pageX - canvas.position().left, e.changedTouches[0].pageY - canvas.position().top);
        
            ctx.moveTo(e.changedTouches[0].pageX - canvas.position().left, e.changedTouches[0].pageY - canvas.position().top);
            console.log("X:"+e.changedTouches[0].pageX+" / Y:"+e.changedTouches[0].pageY);
            drawMode = true;
            e.preventDefault();
        })
        .on(clickEvent_move,function (e) {
            if (drawMode) {
//                ctx.lineTo(e.changedTouches[0].pageX - canvas.position().left, e.changedTouches[0].pageY - canvas.position().top);
                ctx.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
                console.log("X:"+e.changedTouches[0].pageX+" / Y:"+e.changedTouches[0].pageY);
                ctx.stroke();
                e.preventDefault();
            }
        })
        .on(clickEvent_end,function (e) {
            drawMode = false;
            e.preventDefault();
        });
    


    function clearPad() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 將canvas內清除成透明png。
        ctx.fillStyle = "white"; //整個canvas塗上白色背景避免PNG的透明底色效果。
        ctx.fillRect(0, 0, canvas.width(), canvas.height()); //Canvas 2D API ，繪畫出矩形的方法。
    }

    
    
    
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
            }, 500);
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
                                if(move<8){ // 第一第二階段。
                                    $(this).show(1000);
                                }else{ // 第三階段，一開始要撥語音。
                                    $(this).show(1000,play_sound());
                                    $('#sound').show(1000);
                                }
                            });
                            $('#sound').hide(1500);
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
            }, 500);
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
                                if(move<8){
                                    $(this).show(1000);
                                }else{ // 第三階段，一開始要撥語音。
                                    $(this).show(1000,play_sound());
                                    $('#sound').show(1000);
                                }
                            });
                            $('#sound').hide(1500);
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
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>恭喜完成<b>挑選練習</b><br>前往下一個訓練 go!!</p>",
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
          // Show loading animation.
          var playPromise = $('#sound_' + file_word[order[step]]).get(0).play();

          if (playPromise !== undefined) {
            playPromise.then(_ => {
              $('#sound_' + file_word[order[step]]).get(0).pause();
            })
            .catch(error => {
                console.log(error);
              // Auto-play was prevented
              // Show paused UI.
            });
          }
        
        var timeout_0 = setTimeout(function () {
            $('#sound_' + file_word[order[step]]).get(0).play(); /*播放第一次語音*/
            console.log('放第一次語音。');
        }, 1000);

        var timeout_1 = setTimeout(function () {
            $('#sound_' + file_word[order[step]]).get(0).play(); /*播放第二次語音*/
            console.log('放第二次語音。');
        }, 2600);

        var timeout_2 = setTimeout(function () {
            $('#sound_' + file_word[order[step]]).get(0).play(); /*播放第三次語音*/
            console.log('放第三次語音。');
        }, 4200);
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
        
        if( round == 0 ){//第一階段
        }else if( round == 1 ){//第二階段
            $('.ima_bg').remove();
            
            /*以下三個屬性為文字或圖像水平、垂直置中的方法中最沒問題的寫法。*/
            $('.select').css('display','flex');
            $('.select').css('align-items','center');
            $('.select').css('justify-content','center');
            
            $('#select_0,#select_1,#select_2,#select_3').css('height','150px');
            $('#select_0,#select_1,#select_2,#select_3').css('top','310px');
            
        }else{//第三階段
            $('.word').css('font-family','support');
            $('.word').css('font-weight','900');
            $('.word').css('font-size','26px');
        }
        
        
    }
    


//    dialog(0);
//    prepare();
    
    
    
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
        if(focus_option == ""){ //沒選擇選項回答。 
            dialog(2);
        }else if($('#'+focus_option).data('answer') == word[order[step]]){// 答對。
            dialog(1);
        }else{ // 答錯。
            dialog(3);
        }
        
    });



});