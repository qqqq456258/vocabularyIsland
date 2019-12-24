$(function(){
    var which_image = "null";
    var which_word = "null";
    var image_click_num = 0;
    var word_click_num = 0;
    var num_of_success = 0;
    var chance = 3;
    var time = 60;
    var time_element;
    var word = ["cat", "hamster", "guinea pig", "rabbit"];// 宣告陣列放入 4 個單字。
    var sound = [];
    var image_order = [];   
    var word_order = [];   
    function getRandomArray(){    //隨機產生不重覆的4個數字
        var rdmArray = [4];     //儲存產生的陣列

        for(var i=0; i<4; i++) {
            var rdm = 0;        //暫存的亂數

            do {
                var exist = false;          //此亂數是否已存在
                rdm = Math.floor(Math.random()*4);    //取得亂數

                //檢查亂數是否存在於陣列中，若存在則繼續回圈
                if(rdmArray.indexOf(rdm) != -1) exist = true;

            } while (exist);    //產生沒出現過的亂數時離開迴圈

            rdmArray[i] = rdm;
         }
        return rdmArray;
    }
    function prepare(){
        // 順序洗牌。
        image_order = getRandomArray();
        word_order = getRandomArray();
        
        // 放入圖片、文字。
        for(var i=0;i<4;i++){
            $("#img_"+(i+1)).attr('src','word_image/'+word[image_order[i]]+'.png');
            $("#img_"+(i+1)).val(word[image_order[i]]);   
            $("#word_"+(i+1)).html(word[word_order[i]]);
        }
        
        //載入聲音檔。
        for(var i=0;i<4;i++){
            sound[i] = document.createElement("audio"); //創建聲音檔元件。
            var sentence = 'word_sound/'+word[i]+'.mp3';
            sound[i].setAttribute("id", "sound_"+word[i].replace(/\s/g, ''));
            sound[i].setAttribute("src",sentence);
            sound[i].setAttribute("preload","auto");
            document.body.appendChild(sound[i])         //把它添加到頁面上。
        }
        
    }
    function playSound(ID){
        var word = "";
        var kind_of_element = $('#'+ID).attr('class');
        if(kind_of_element == "image"){
            word = $('#'+ID).val().replace(/\s/g, '');
        }else{
            word = $('#'+ID).text().replace(/\s/g, '');
        }
        $('#sound_'+word).get(0).play();
    }
    function StartTime(){
        time_element = setInterval(setTime,50);
    }
    function setTime(){
        time = time - 0.05;
        $('#control_time').text(time.toFixed(1));
        if(time.toFixed(1)<0){
            StopTime();
            console.log("time:"+time);
            time = 0.0;
            $('#control_time').text(time.toFixed(1));
            dialog_message(0);
            $(".image").attr('disabled', 'disabled');
            $(".word").attr("disabled", "disabled").off('click');
        }
    }
    function StopTime(){
        clearInterval(time_element);
    }
    function dialog_message(situation) {
        if(situation == 0){     // 時間到，遊戲失敗。
            swal.fire({
                    title: "Failure",
                    text: "Time's up !!",
                    icon: "error",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: ["Back", "Try again !!"],  //客製化按鈕。
                    dangerMode: true
                })
                .then((result) => {
                    if(result){
                        location.reload();
                    }else{
                        alert("回到上一頁。");
                        location.reload();
                    }
                });
        }else if(situation == 1){     // 機會次數用完，遊戲失敗。
            swal.fire({
                    title: "Failure",
                    text: "No any chance !!",
                    icon: "error",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: ["Back", "Try again !!"],  //客製化按鈕。
                    dangerMode: true
                })
                .then((result) => {
                    if(result){
                        location.reload();
                    }else{
                        alert("回到上一頁。");
                        location.reload();
                    }
                });
        }else if(situation == 2){
            swal.fire({
                    title: "Success",
                    text: "You spent "+(60-time).toFixed(1)+" seconds.",
                    icon: "success",
                    button: true,
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    dnagerMode: true
                })
                .then((result) => {
                    location.reload();
                });
        }
    }
    
    prepare();
    StartTime();
    
    
   $(".image,.word").on("click", function () { // 點擊目標時。
       
       if ($(this).attr('class') == "image") {
           if (image_click_num == 0) { // 首次點擊圖片之情況。
               which_image = $(this).attr('id');
               $("#" + which_image).css('border', '6px solid #00BBFF');
               playSound(which_image);
               image_click_num++;
               console.log("圖片點擊數："+image_click_num);
               console.log("圖片對象："+which_image);

           } else { // 已點擊圖片之情況。
               $("#" + which_image).css('border', '6px solid rgb(212, 238, 227)');
               if ($(this).attr('id') == which_image) { // 同一目標之情況。
                   which_image = "null";
                   image_click_num = 0;
                   console.log("圖片點擊數："+image_click_num);
                   console.log("圖片取消！");

               } else { // 不同目標之情況。
                   which_image = $(this).attr('id');
                   $(this).css('border', '6px solid #00BBFF');
                   playSound(which_image);
                   console.log("圖片點擊數："+image_click_num);
                   console.log("圖片對象："+which_image);
               }
           }
       } else {
           if (word_click_num == 0) { // 首次點擊文字之情況。
               which_word = $(this).attr('id');
               $("#" + which_word).css('border', '6px solid #00BBFF');
               $("#" + which_word).css('backgroundColor', '#CCEEFF');
               playSound(which_word);
               word_click_num++;
               console.log("文字點擊數："+word_click_num);
               console.log("文字對象："+which_word);

           } else { // 已點擊文字之情況。
               $("#" + which_word).css('backgroundColor', 'white');
               $("#" + which_word).css('border', '6px solid rgb(212, 238, 227)');
               if ($(this).attr('id') == which_word) { // 同一目標之情況。
                   which_word == "null";
                   word_click_num = 0;
                   console.log("文字點擊數："+word_click_num);
                   console.log("文字取消！");

               } else { // 不同目標之情況。
                   which_word = $(this).attr('id');
                   $(this).css('backgroundColor', '#CCEEFF');
                   $(this).css('border', '6px solid #00BBFF');
                   playSound(which_word);
                   console.log("文字點擊數："+word_click_num);
                   console.log("文字對象："+which_word);
               }
           }
       }
       if (word_click_num == 1 && image_click_num == 1) { // 判斷對錯。
            $('#correct_sound').get(0).pause();
            $('#wrong_sound').get(0).pause();
           if ($("#" + which_image).val() == $("#" + which_word).text()) { //  正確。
               
               $('#correct_sound').currentTime = 0;
               $('#correct_sound').get(0).play();
               
               $("#" + which_image + ",#" + which_word).fadeTo(500, 0, function () {
                   $("#" + which_image).attr('disabled', 'disabled');
                   $("#" + which_word).attr("disabled", "disabled").off('click');
                   $(".image").css('border', '6px solid rgb(212, 238, 227)');
                   which_image = "null";
                   image_click_num = 0;
                   
                   console.log("圖片點擊數："+image_click_num);
                   console.log("圖片對象取消！");
                   
                   $(".word").css('border', '6px solid rgb(212, 238, 227)');
                   $(".word").css('backgroundColor', 'white');
                   which_word = "null";
                   word_click_num = 0;
                   
                   console.log("文字點擊數："+word_click_num);
                   console.log("文字對象取消！");
                   
               });
               
               num_of_success++;
               
               console.log("配對成功數:"+num_of_success);
               
               if ( num_of_success == 4 ){    // 遊戲完成。
                   $('#control_time').text(time.toFixed(1));
                   StopTime();
                   $(".image").attr('disabled', 'disabled');
                   $(".word").attr("disabled", "disabled").off('click');
                   dialog_message(2);
               }

           } else { //  錯誤。
               $('#wrong_sound').currentTime = 0;
               $('#wrong_sound').get(0).play();
               $(".word").css('border', '6px solid rgb(212, 238, 227)');
               $(".word").css('backgroundColor', 'white');
               $(".image").css('border', '6px solid rgb(212, 238, 227)');
               
               chance--;
               console.log("機會："+chance);
               $('#control_chance').text(chance);
               
               which_image = "null";
               which_word = "null";
               image_click_num = 0;
               word_click_num = 0;
               
                   console.log("圖片點擊數："+image_click_num);
                   console.log("圖片對象取消！");
                   console.log("文字點擊數："+word_click_num);
                   console.log("文字對象取消！");
               
               if(chance%2 == 0){
                   $('#chance').css('transform','rotate(5deg)');
                   $('#chance').css('fontSize','33px');
               }else{
                   $('#chance').css('transform','rotate(-5deg)');
               }
               
               if ( chance == 0 ){    // 遊戲失敗。
                   $('#control_time').text(time.toFixed(1));
                   StopTime();
                   $(".image").attr('disabled', 'disabled');
                   $(".word").attr("disabled", "disabled").off('click');
                   dialog_message(1);
               }
           }
       }
   });
});