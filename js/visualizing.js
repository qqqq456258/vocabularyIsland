$(function () {
    var word = ["cat", "hamster", "guinea pig", "rabbit"]; // 宣告陣列放入 4 個單字。
    var partOfSpeech = ["(n.)", "(n.)", "(n.)", "(n.)"]; // 宣告陣列放入 4 個單字詞性。
    var definition = ["貓", "倉鼠", "天竺鼠", "兔子"]; // 宣告陣列放入 4 個單字翻譯。
    var file_word = []; // 宣告陣列放入 4 個去除空格的單字，來命名檔案名稱。
    var order = []; // 宣告陣列放入排序。
    var sound = []; // 宣告陣列放入 4 個語音檔。
    let move = 0; // 表示總共步驟。
    let choose_target = "";
    let focus_option = ""; //目前所選擇的選項。
    let pick_image = "";
    var canvas = $('#canvas_draw');
    var ctx = canvas.get(0).getContext("2d");
    var cPushArray = new Array();
    var cStep = -1;
    var colors = "red;#ab0000;#da7f01;yellow;#7fccab;darkgreen;#61b9ff;#0059a0;#9155fb;#b7b7b7;white;black".split(';');
    var sb = [];
    

    function cPush() {
        console.log('cStep:'+cStep);
        console.log('cPushArray.length:'+cPushArray.length);
        cStep++;
         if (cStep < cPushArray.length) {
             cPushArray.length = cStep;
         }
         cPushArray.push(canvas.get(0).toDataURL());
     }
    
    
    $.each(colors, function (i, v) {
        if(i%4 == 0 == i>0){
            sb.push("<br>");
        }
        sb.push("<div class='option' style='background-color:" + v + "'></div>");
    });
    $("#palette").html(sb.join("\n"));
    //線條粗細選項
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


    
    //ctx 屬性。
    ctx.fillStyle = "white"; //整個canvas塗上白色背景避免PNG的透明底色效果
    ctx.fillRect(0, 0, canvas.width(), canvas.height()); //Canvas 2D API 绘制填充矩形的方法。
    ctx.lineCap = "round"; //圓滑軌跡。
    
    cPush();
    
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
            return 'mousemove';
    })();
    const clickEvent_end = (function () {
        if ('ontouchend' in document.documentElement === true)
            return 'touchend';
        else
            return 'mouseup';
    })();
    
    /*用事件綁定，繪出畫筆軌跡*/
    var drawMode = false;
    var position = null;
    canvas.on(clickEvent_start,function (e) {
            drawMode = true;
            ctx.beginPath();
            ctx.strokeStyle = p_color;
            ctx.lineWidth = p_width;
        
            if(clickEvent_start == 'touchstart'){
                position = e.changedTouches[0];
            }else{
                position = e;
            }
        
            ctx.moveTo(position.pageX-canvas.offset().left,position.pageY-canvas.offset().top);
            e.preventDefault();
        })
        .on(clickEvent_move,function (e) {
            if (drawMode) {
                
                if(clickEvent_move == 'touchmove'){
                    position = e.changedTouches[0];
                }else{
                    position = e;
                }
                
                
                ctx.lineTo(position.pageX-canvas.offset().left,position.pageY-canvas.offset().top);
                ctx.stroke();
                
//                console.log("X:"+position.pageX-canvas.offset().left);
//                console.log("Y:"+position.pageY-canvas.offset().top);
                
                e.preventDefault();
            }
        })
        .on(clickEvent_end,function (e) {
            drawMode = false;
            cPush();
            e.preventDefault();
        });
    

    $('#undo').on('click',function(){
         if (cStep > 0) {
             cStep--;
             var canvasPic = new Image();
             canvasPic.src = cPushArray[cStep];
             canvasPic.onload = function () {
                 ctx.drawImage(canvasPic, 0, 0);
             }
         }
    });
    $('#redo').on('click',function(){
         if (cStep < cPushArray.length - 1) {
             cStep++;
             var canvasPic = new Image();
             canvasPic.src = cPushArray[cStep];
             canvasPic.onload = function () {
                 ctx.drawImage(canvasPic, 0, 0);
             }
         }
    });
    $('#clear').on('click',function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 將canvas內清除成透明png。
        ctx.fillStyle = "white"; //整個canvas塗上白色背景避免PNG的透明底色效果。
        ctx.fillRect(0, 0, canvas.width(), canvas.height()); //Canvas 2D API ，繪畫出矩形的方法。
    });

    
    
    
    
    
    
    
    
    
    /*sweetAlert2 的功能。*/
    function dialog(situation) {
        console.log("Dialog:" + situation);
        if (situation == 0) { //開始前說明。
            swal.fire({
                    icon: "info",
                    title: "Picking",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;padding-left: 10px;'>挑選一個單字做成字卡吧！</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: " O K "
                })
                .then((result) => {
                    if (result.value) {
                        $('#title_en').show(500);
                        $('#word_pick_0,#word_pick_1,#word_pick_2,#word_pick_3').fadeIn(1000);
                        $('#next_btn').show(1000);
                        console.log("進入製作字卡畫面。");
                    }
                });
            
        } else if (situation == 1) { // 答對。
            
            $('#sound_correct').get(0).play();
            
            
            if (move == 0) {
                $('#title_en').hide(1500, function () {
                    /* 內容變化。*/
                    change_content(0);
                });
            } else if (move == 1) {
                $('#title_en').hide(1500, function () {
                    /* 內容變化。*/
                    change_content(1);
                });
            } else if (move == 2){
                $('#title_en').hide(1500, function () {
                    /* 內容變化。*/
                    change_content(2);
                });
            }else{
                dialog(4);
            }
            
        } else if (situation == 2) { // 沒選擇選項。
            
            $('#sound_wrong').get(0).play();
            
            swal.fire({
                    icon: "warning",
                    title: "警告",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>請擇一選項。</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                });
            
        }else { // 完成挑選練習。
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
                        console.log("回到主畫面");
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

    /*進度條*/
    function progress() {
        let total_move = 4;
        move++;
        percentage = Math.floor(move / 4 * 100);
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
        for(let k=0;k<4;k++){
            
            /*去除空格。*/
            var regex = /\s/;
            file_word[k] = word[k].replace(regex,'');

            /*對元素創建標籤。*/
            /*對元素放入標籤。*/
            $('#word_pick_'+k).data('target',file_word[k]);
            $('#word_pick_'+k).html(word[k]);
        }
        
    }
    /*選項變化*/
    function change_content(move){
        focus_option = "";
        
        if( move == 0 ){//第一階段結束。
            $('#title_en').text('Pick up a your Favorite Picture');
            $('#next_btn').hide(1000);
            $('.word').hide(1000);
            
            $('#img_0').attr('src','word_image/'+$('#'+choose_target).data('target')+'_0.jpg');
            $('#img_1').attr('src','word_image/'+$('#'+choose_target).data('target')+'_1.jpg');
            $('#img_2').attr('src','word_image/'+$('#'+choose_target).data('target')+'_2.jpg');
            
            $('#user_zone').hide(1500,function(){
                $('.picture').css('display','flex');
                $('#user_zone').show(1000);
                $('#title_en').show(1000);
                $('#next_btn').show(1500);
            });
            
        }else if( move == 1 ){//第二階段結束。
            $('#title_en').text('Draw your style');
            $('#next_btn').hide(1000);
            $('.picture').hide(1000);
            $('#canvas_draw').css('backgroundImage','url('+$('#'+pick_image).attr('src')+')');
            
            $('#user_zone').hide(1500,function(){
                $('#user_zone').show(1000);
                $('#title_en').show(1000);
                $('#palette').show(1000);
                $('#line').show(1000);
                $('#canvas_position').show(1000);
                $('#btn_zone').show(1000);
                $('#next_btn').show(1500);
            });
        }else if( move == 2){//第三階段結束。
            console.log("內容還沒弄。");
//            $('#title_en').text('Create your Style');
//            $('#next_btn').hide(1000);
        }
        progress();
        
    }
    

    prepare();
    dialog(0);
    
    
    
    /*練習發音時，點擊聽單字發音*/
    $('#sound').on('click', function () {
        event.preventDefault();
        event.stopPropagation();
        /*播放語音*/
        play_sound();
    });
    
    /*點擊選項時的反饋*/
    $('.word').on('click',function(){
        event.preventDefault();
        event.stopPropagation();
        if(focus_option == $(this).attr('id')){ // 取消自身選擇。
            focus_option = "";
            $(this).css('border','5px solid grey');
            $(this).css('backgroundColor','white');
            
        }else{  // 其他選項變化。
            $(".word").css('border','5px solid grey');
            $(".word").css('backgroundColor','white');
            $(this).css('border','5px solid darkgreen');
            $(this).css('backgroundColor','#ddffda');
            focus_option = $(this).attr('id');
        }
        console.log("目前選擇之ID:"+focus_option);
        console.log("目前選擇之data-target:"+$('#'+focus_option).data('target'));
    });
    
    /*點擊選項時的反饋*/
    $('.picture').on('click',function(){
        event.preventDefault();
        event.stopPropagation();
        if(focus_option == $(this).attr('id')){ // 取消自身選擇。
            focus_option = "";
            $(this).css('border','3px solid grey');
            $(this).css('backgroundColor','white');
            
        }else{  // 其他選項變化。
            $(".picture").css('border','3px solid grey');
            $(".picture").css('backgroundColor','white');
            $(this).css('border','3px solid darkgreen');
            $(this).css('backgroundColor','white');
            focus_option = $(this).attr('id');
        }
        pick_image = "img_"+focus_option.split("_")[2];
        console.log("目前選擇之ID:"+focus_option);
        console.log("目前選擇之target:"+pick_image);
    });
    
    
    /*點擊Done*/
    $('#next_btn').on('click',function(){
        event.preventDefault();
        event.stopPropagation();
        if(focus_option == ""){ //沒選擇選項回答。 
            if(move == 0){ //第一階段
                dialog(2);
            }else if(move == 1){ //第二階段
                dialog(2);
            }else if(move == 2){ //第三階段
                dialog(2);
            }else{
                dialog(2);
            }
        }else{ //回答成功。 
            if(move == 0){ //第一階段
                choose_target = focus_option; //放入目標單字。
                dialog(1);
            }else if(move == 1){ //第二階段
                dialog(1);
            }else if(move == 2){ //第三階段
                dialog(1);
            }else{
                dialog(1);
            }
        }
        
    });



});