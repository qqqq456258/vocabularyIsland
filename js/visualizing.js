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
    let ns_sound_target = ""; //所選擇的去除空格單字。
    let pick_image = "";
    
    var canvas = $('#canvas_draw');
    var cPushArray = new Array();
    var cStep = -1;
    var ctx = canvas.get(0).getContext("2d");
    var colors = "red;#ab0000;#da7f01;yellow;#7fccab;darkgreen;#61b9ff;#0059a0;#9155fb;#b7b7b7;white;black".split(';');
    var colors_bg = "#ffc5c5;#ffc8a4;#fdf7c3;#c3fdd1;#7fccab;#9dfff8;#97d1ff;#d7edff;#d5d3ff;#b7b7b7;#efefef;white".split(';');
    var colors_br = "#e66262;#ab0000;#da7f01;#ffc800;#7fccab;darkgreen;#61b9ff;#0059a0;#b79aff;black;#b7b7b7;white".split(';');
    var sb = [];
    var color_bg = [];
    var color_br = [];
    
    
    /*後端所需全域變數*/
    let this_page = new URL(location.href); //取得完整網址（URL）。
    let theme = this_page.searchParams.get('theme');
    let title = this_page.searchParams.get('title');
    let practice = this_page.searchParams.get('practice');
    let file_name = "";
    let date_time = "";
    let bg_color = "rgb(255,255,255)";
    let br_color = "rgb(183,183,183)";
    
    
    
    /* 抓取自己最新的單字發音。*/
    function get_own_audio_file(target){
        
        console.log('target:'+target);
        console.log('theme:'+theme);
        console.log('title:'+title);
        console.log('practice:'+practice);
        
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/visualizing.php",
            data: {
                code: 0,
                vocabulary:target,
                theme_code:theme,
                title_code:title,
                practice_code:practice
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
                file_name = json['record'][0];
                date_time = json['record'][1];

                var voice = document.createElement("audio"); //創建聲音檔元件。
                voice.setAttribute("id", "self_pronunciation");
                voice.setAttribute("src", 'upload/sound/'+file_name+'.wav');
                voice.setAttribute("preload", "auto");
                document.body.appendChild(voice); //把它添加到頁面上。
                
            },
            error: function (error) {
                console.log(error.responseText);
                alert('get_own_audio_file : Wrong。');
                
            }
        });
    }
    
    /* 建立圖檔並插入圖片資訊。*/
    function insert_picture_information(target,base64,filename,date){
        
        console.log('vocabulary:'+target);
        console.log('base64:'+base64);
        console.log('filename:'+filename);
        console.log('date:'+date);
        console.log('theme:'+theme);
        console.log('title:'+title);
        console.log('practice:'+practice);
        
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/visualizing.php",
            data: {
                code: 1,
                base64:base64,
                vocabulary:target,
                filename:filename,
                datetime:date,
                theme_code:theme,
                title_code:title,
                practice_code:practice
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
            },
            error: function (error) {
                console.log(error.responseText);
                alert('insert_picture_information : Wrong。');
                
            }
        });
    }
    
    /* 插入字卡資訊。*/
    function insert_card_information(target,base64,bg_color,br_color,filename,date){
        
        console.log('vocabulary:'+target);
        console.log('base64:'+base64);
        console.log('bg_color:'+bg_color);
        console.log('br_color:'+br_color);
        console.log('filename:'+filename);
        console.log('date:'+date);
        console.log('theme:'+theme);
        console.log('title:'+title);
        console.log('practice:'+practice);
        
        $.ajax({
            type: "POST",
            async: false, //async設定true會變成異步請求。
            cache: true,
            url: "php/visualizing.php",
            data: {
                code: 2,
                base64:base64,
                bg_color:bg_color,
                br_color:br_color,
                vocabulary:target,
                filename:filename,
                datetime:date,
                theme_code:theme,
                title_code:title,
                practice_code:practice
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
            },
            error: function (error) {
                console.log(error.responseText);
                alert('insert_card_information : Wrong。');
                
            }
        });
    }
    
    
/*

Log :

    1. 挑選的單字。
    2. 字卡背景顏色。
    3. 字卡邊框顏色。

*/    
    
    

    function cPush() {
        cStep++;
         if (cStep < cPushArray.length) {
             cPushArray.length = cStep;
         }
         cPushArray.push(canvas.get(0).toDataURL());
         console.log('cStep:'+cStep);
         console.log('cPushArray.length:'+cPushArray.length);
     }
    
    /*字卡背景的色盤*/
    $.each(colors_bg, function (i, v) {
        if(i%4 == 0 == i>0){
            color_bg.push("<br>");
        }
        color_bg.push("<div class='option_bg' style='background-color:" + v + "'></div>");
    });
    $("#palette_background").html(color_bg.join("\n"));
    /*字卡邊框的色盤*/
    $.each(colors_br, function (i, v) {
        if(i%4 == 0 == i>0){
            color_br.push("<br>");
        }
        color_br.push("<div class='option_br' style='background-color:" + v + "'></div>");
    });
    $("#palette_border").html(color_br.join("\n"));
    
    
    /*字卡背景的事件*/
    $("#palette_background .option_bg").on('click',function(){
        $("#palette_background .option_bg").removeClass("active");
        $(this).addClass("active");
        $('#card').css('backgroundColor',this.style.backgroundColor);
        bg_color = this.style.backgroundColor;
    });
    /*字卡邊框的事件*/
    $("#palette_border .option_br").on('click',function(){
        $("#palette_border .option_br").removeClass("active");
        $(this).addClass("active");
        $('#card').css('border','8px solid '+this.style.backgroundColor);
        br_color = this.style.backgroundColor;
    });

    

    
    
    /*繪畫用的色盤*/
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
                 console.log('載入成功,undo');
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
                 console.log('載入成功,redo');
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
                    title: "Card Making",
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
            
        } else if (situation == 1) { // 答對情況。
            
            $('#sound_correct').get(0).play();
            
            
            if (move == 0) { // 第一步驟→第二步驟。
                $('#title_en').hide(1500, function () {
                    /* 內容變化。*/
                    change_content(0);
                });
            } else if (move == 1) { // 第二步驟→第三步驟。
                $('#title_en').hide(1500, function () {
                    /* 內容變化。*/
                    change_content(1);
                });
            } else if (move == 2){ // 第三步驟→第四步驟。
                $('#title_en').hide(1500, function () {
                    /* 內容變化。*/
                    change_content(2);
                });
            }else{ // 完成 字卡製作。
                dialog(3);
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
            
        }else { // 完成字卡製作。
            $('#sound_correct').get(0).play();
            progress();
            
            
            
            swal.fire({
                    icon: "success",
                    title: "完成",
                    html: "<p style='font-family:Microsoft JhengHei;font-size:22px;'>恭喜完成<b>字卡製作</b>!!</p>",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    confirmButtonText: "O K"
                })
                .then((result) => {
                    if (result.value) {
                        
                        insert_card_information($('#'+choose_target).text(),($('#canvas_draw')[0]).toDataURL('image/jpeg'),bg_color,br_color,file_name,date_time);
                        
                        console.log("回到主畫面");
                        location.replace('world.html');
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
    /*載入聲音檔。*/
    function loading_sound(sound_target) {
        /*去除空格。*/
        var regex = /\s/;
        ns_sound_target = sound_target.replace(regex,''); //沒有空格的單字目標。
        
        $.ajax({
            type: "get",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/get_data_from_LearningChocolate.php",
            data: {
                value: sound_target,
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);

                var voice = document.createElement("audio"); //創建聲音檔元件。
                voice.setAttribute("id", "sound_" + ns_sound_target);
                voice.setAttribute("src", json[0].sounds[0].fileName);
                voice.setAttribute("preload", "auto");
                document.body.appendChild(voice); //把它添加到頁面上。
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                console.log('error, use the plan B.');
                var voice = document.createElement("audio"); //創建聲音檔元件。

                voice.setAttribute("id", "sound_" + ns_sound_target);
                voice.setAttribute("src", "word_sound/" + ns_sound_target + ".mp3");
                voice.setAttribute("preload", "auto");
                document.body.appendChild(voice);
            }


               
        });
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
        
        if( move == 0 ){//第一步驟結束。
            $('#title_en').text('Pick up a picture you favored');
            $('#next_btn').hide(1000);
            $('.word').hide(1000);
            
            $('#img_0').attr('src','word_image/'+$('#'+choose_target).data('target')+'_0.jpg');
            $('#img_1').attr('src','word_image/'+$('#'+choose_target).data('target')+'_1.jpg');
            $('#img_2').attr('src','word_image/'+$('#'+choose_target).data('target')+'_2.jpg');
            
            $('#user_zone').hide(1500,function(){
                //進入第二步驟。
                $('.picture').css('display','flex');
                $('#user_zone').show(1000);
                $('#title_en').show(1000);
                $('#next_btn').show(1500);
            });
            
        }else if( move == 1 ){//第二步驟結束。
            $('#title_en').text('Draw the picture in your style');
            $('#next_btn').hide(1000);
            $('.picture').hide(1000);
            console.log('choose_target:'+$('#'+choose_target).text());
            loading_sound($('#'+choose_target).text()); // 載入語音。
            console.log('你挑的圖片：'+pick_image);
            
            /*宣告所選擇的圖片。*/
            var img = document.getElementById(pick_image);
            
            /*ctx 屬性設定。*/
            ctx.fillStyle = "white"; //整個canvas塗上白色背景避免PNG的透明底色效果
            ctx.fillRect(0, 0, canvas.width(), canvas.height()); //Canvas 2D API 绘制填充矩形的方法。
            ctx.lineCap = "round"; //圓滑軌跡。
            
            /*宣告所需的變數。*/
            const img_w = img.naturalWidth; // drawImage 會抓原始圖檔大小，故用 DOM 抓圖片原始寬度。
            const img_h = img.naturalHeight; // drawImage 會抓原始圖檔大小，故用 DOM 抓圖片原始高度。
            let dx = 0; // drawImage 將圖片放上 canvas 的起始點座標X。
            let dy = 0; // drawImage 將圖片放上 canvas 的起始點座標Y。
            let dWidth = 0; // drawImage 將圖片放上 canvas 的圖片寬度。
            let dHeight = 0; // drawImage 將圖片放上 canvas 的圖片高度。
            
            /*判斷原始圖片的長寬哪個值較大，再依比例去變化。*/
            if(img_w > img_h){
                dHeight = (img_h /img_w)*350;
                dWidth = 350;
                dx = 0;
                dy = 175 - dHeight/2;
            }else if(img_w == img_h){
                dHeight = 350;
                dWidth = 350;
            }else{
                dWidth = (img_w /img_h)*350;
                dHeight = 350;
                dx = 175 - dWidth/2;
                dy = 0;
            }
            
            /*先在 canvas 上畫出圖形。*/
            ctx.drawImage(img,dx,dy,dWidth,dHeight);
            
            /*
                將背景從透明轉變成白色。
                解決方案一:將透明的pixel設成白色，因為png圖片的背景都是透明的,所以我們可以尋找透明的pixel,然後將其全部設成白色。
                canvas 寬和高皆為 350 px;
            */
            var imageData = ctx.getImageData(0, 0, 350, 350);
            for (var i = 0; i < imageData.data.length; i += 4) {
                // 當該像素是透明的,則設置成白色
                if (imageData.data[i + 3] == 0) { // 檢查 A 值。
                    imageData.data[i + 0] = 255; // R
                    imageData.data[i + 1] = 255; // G
                    imageData.data[i + 2] = 255; // B
                    imageData.data[i + 3] = 255; // A(0-255; 0是透明的，255是完全可見的)
                }
            }
            /* putImageData 函式，能將一個 ImageData 繪製到 canvas 上 */
            ctx.putImageData(imageData, 0, 0);
            
            /* 將完成的canvas 記錄下來，以方便使用undo / redo */
            cPush();
            
            
            
            
            $('#user_zone').hide(1500,function(){
                //進入第三步驟。
                $('#user_zone').show(1000);
                $('#title_en').show(1000);
                $('#palette').show(1000);
                $('#line').show(1000);
                $('#canvas_position').show(1000);
                $('#btn_zone').show(1000);
                $('#next_btn').show(1500);
            });
        }else if( move == 2){//第三步驟結束。
            insert_picture_information($('#'+choose_target).text(),($('#canvas_draw')[0]).toDataURL('image/jpeg'),file_name,date_time);
            
            $('#vocabulary').text(word[choose_target.split("_")[2]]);
            $('#part_speech').text(partOfSpeech[choose_target.split("_")[2]]);
            $('#definition').text(definition[choose_target.split("_")[2]]);
            
            $('#title_en').text('Create the card in your style');
            $('#picture').attr('src',($('#canvas_draw')[0]).toDataURL('image/jpeg'));
            $('#palette').hide(1000);
            $('#line').hide(1000);
            $('#canvas_position').hide(1000);
            $('#btn_zone').hide(1000);
            $('#next_btn').hide(1000);
            $('#next_btn').attr('src','material/OK.png');
            
            $('#user_zone').hide(1500,function(){
                //進入第四步驟。
                $('#user_zone').show(1000);
                $('#title_en').show(1000);
                $('#card').show(1000);
                $('#background_zone').show(1000);
                $('#border_zone').show(1000);
                $('#next_btn').show(1500);
            });
        }
        progress();
        
    }
    
    
    
    

    prepare();
    dialog(0);
    
    
    
    
    $('#normal_sound').on('click', function () {
        // Show loading animation.
        var playPromise = $('#sound_' + ns_sound_target).get(0).play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                    $('#sound_' + ns_sound_target).get(0).pause();
                    $('#sound_' + ns_sound_target).get(0).play();
                
                })
                .catch(error => {
                    console.log(error);
                    // Auto-play was prevented
                    // Show paused UI.
                });
        }
    });
    
    $('#self_sound').on('click', function () {
        // Show loading animation.
        var playPromise = $('#self_pronunciation').get(0).play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                    $('#self_pronunciation').get(0).pause();
                    $('#self_pronunciation').get(0).play();
                
                })
                .catch(error => {
                    console.log(error);
                    // Auto-play was prevented
                    // Show paused UI.
                });
        }
    });
    
    
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
    });
    
    /*點擊選項時的反饋*/
    $('.picture').on('click',function(){
        event.preventDefault();
        event.stopPropagation();
        if(focus_option == $(this).attr('id')){ // 取消自身選擇。
            focus_option = "";
            $(this).css('border','5px solid #AAA');
            $(this).css('backgroundColor','white');
            
        }else{  // 其他選項變化。
            $(".picture").css('border','5px solid #AAA');
            $(".picture").css('backgroundColor','white');
            $(this).css('border','5px solid darkgreen');
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
        if(focus_option == "" && move<2){ //沒選擇選項回答。 
            dialog(2);
        }else{ //回答成功。
            if(move == 0){ //第一步驟
                choose_target = focus_option; //放入目標單字。
                get_own_audio_file($('#'+choose_target).text()); // 找先前基礎練習所練習的發音。
                
                dialog(1);
            }else{
                dialog(1);
            }
        }
        
    });



});