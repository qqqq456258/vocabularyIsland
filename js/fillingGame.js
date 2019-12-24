$(function(){
    let word = ["cat", "hamster", "guinea pig", "rabbit"];// 宣告陣列放入 4 個單字。
    let partOfSpeech = ["(n.)", "(n.)", "(n.)", "(n.)"];// 宣告陣列放入 4 個單字詞性。
    let definition = ["貓", "倉鼠", "天竺鼠", "兔子"];// 宣告陣列放入 4 個單字翻譯。
    let chance = 3;// 挑戰次數。
    let time = 60;//  時間。
    let time_element;
    let order = [];
    let word_length = 0;
    let target = '';
    let answer = '';
    let round = 0;
    let letter_position_situation;
    
    function getRandomArray(num){    //隨機產生不重覆的4個數字
        let rdmArray = [num];     //儲存產生的陣列

        for(let i=0; i<num; i++) {
            let rdm = 0;        //暫存的亂數

            do {
                var exist = false;          //此亂數是否已存在
                rdm = Math.floor(Math.random()*num);    //取得亂數

                //檢查亂數是否存在於陣列中，若存在則繼續回圈
                if(rdmArray.indexOf(rdm) != -1) exist = true;

            } while (exist);    //產生沒出現過的亂數時離開迴圈

            rdmArray[i] = rdm;
         }
        return rdmArray;
    }
    function StartTime(){
        time_element = setInterval(setTime,10);
    }
    function setTime(){
        time = time - 0.01;
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
        if(situation == 0){     // 時間到、錯誤次數太多，遊戲失敗。
            swal.fire({
                    title: target,
                    icon: "error",
                    imageUrl:'word_image/'+target+'.png',
                    imageWidth: 200,
                    imageHeight: 200,
                    allowOutsideClick: false,
                    allowEscapeKey : false
                })
                .then((result) => {
                    $('#sound').remove();
                    $('#input_zone').empty();
                    $('#btn_zone').empty();
                
                    if(round < 4 ){
                        time = 60;
                        chance = 3;
                        playGame(round);
                        StartTime();
                        round++;
                    }else{
                        location.reload();
                    }
                    
                console.log("chance:"+chance);
                });
        }else if(situation == 1){   //遊戲完成。
            swal.fire({
                    title: "Success",
                    html: 'You spent <b style="color:red;font-size:25px;">'+(60-time).toFixed(1)+'</b> seconds.',
                    icon: "success",
                    allowOutsideClick: false,
                    allowEscapeKey : false
                })
                .then((result) => {
                    $('#sound').remove();
                
                    if(round < 4 ){
                        time = 60;
                        chance = 3;
                        playGame(round);
                        StartTime();
                        round++;
                    }else{
                        location.reload();
                    }
                });
        }else if(situation == 2){  // 遊戲剛開始的情況下。
            swal.fire({
                    title: "Click a Letter and Spell the word",
                    html:'You have <b style="color:red;font-size:25px;">60</b> seconds per word.',
                    imageUrl:'material/animat-layers.gif',
                    imageWidth: 200,
                    imageHeight: 200,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Play',
                    allowOutsideClick: false,
                    allowEscapeKey : false
                })
                .then((result) => {
                    setTimeout(function(){$("#sound").get(0).play();},500);
                    StartTime();
                    round++;
                });
        }
    }
    function check_answer(){ //監聽答案。
        answer = "";
        for(let i = 0 ; i < word_length ; i++){
            answer = answer +$('#space_'+i).text();
        }
        console.log("answer:"+answer);
    }
    function change_content(){ // 移除上一關卡內容物。
        $('#input_zone').empty();
        $('#btn_zone').empty();
        $('#picture').empty();
        chance = 3 ;
        $('#control_chance').text(3);
        $('#chance').css('transform','');
        $('#chance').css('font-size','30px');
        
        //  JQ on事件，需要以JQ off 去解除事件綁定，避免重複執行。
        $(".letter").off('click');
        $('.space').off('click');
        $('#confirm').off('click');
        $('#word_sound').off('click');

        
    }
    
    function together(){    // 事件重新綁定。
        $('#word_sound').on('click',function(){//放發音
                $("#sound").get(0).play();
        });
        $('.letter').on('click', function () {
            $(this).css('visibility', 'hidden'); // letter 原封不動，僅隱藏。
            /*找到被點擊的letter位置。*/
            let ID = $(this).attr('id');
            let arry = ID.split("_");
            let position = arry[1];

            letter_position_situation[position][1] = 0; // 0 表示letter不在回答區，隱藏起來。
            let letter = $(this).text(); //抓英文字母。

            for (let l = 0; l < word_length; l++) { //掃描目前 letter。
                if ($('#space_' + l).text() == "") { //抓從左邊開始的首個空位位置。

                    $('#space_' + l).css('backgroundColor', '#888');
                    $('#space_' + l).text(letter);

                    break;
                }
            }
            check_answer();
        });
        $('.space').on('click', function () {
            if( $(this).css('backgroundColor') == "rgb(136, 136, 136)"){

                let letter = $(this).text();    //抓英文字母。

                $(this).css('backgroundColor','white');
                $(this).text('');

                for(let i = 0 ; i<word_length ; i++){
                    if(letter_position_situation[i][0] == letter && letter_position_situation[i][1] == 0){   //抓原先letter 的位置，並且回答區尚未回來的letter。
                        letter_position_situation[i][1] = 1; // letter 回到回答區。
                        $('#letter_'+i).css('visibility','visible'); //隱形取消。
                        break;
                    }
                }
                check_answer();

            }
        });
        $('#confirm').on('click', function () { // 按下確認鍵時的判斷。
            if (target == answer) {
                setTimeout(function(){$("#sound").get(0).play();},1500);
                $('#correct_sound').get(0).play();
                dialog_message(1);
            } else {
                chance--;
                console.log("Afterchance:"+chance);
                $('#wrong_sound').get(0).play();
                $('#control_chance').text(chance);
                setTimeout(function(){$("#sound").get(0).play();},1000);

                if (chance % 2 == 0) {
                    $('#chance').css('transform', 'rotate(5deg)');
                    $('#chance').css('fontSize', '33px');
                } else {
                    $('#chance').css('transform', 'rotate(-5deg)');
                }

                if (chance == 0) { // 遊戲失敗。
                    StopTime();
                    $('#control_time').text(time.toFixed(1));
                    dialog_message(0);
                }
            }
    });
    }
    function playGame(round){ //載入新遊戲。
        change_content();
        let i = round;
        // 放入圖片、中文。
        $("#picture").attr('src', 'word_image/' + word[order[i]] + '.png');
        $("#speechOfPart").text(partOfSpeech[order[i]]);
        $("#definition").text(definition[order[i]]);

        //載入聲音檔。
        let sound = document.createElement("audio"); //創建聲音檔元件。
        let sentence = 'word_sound/'+word[order[i]]+'.mp3';
        sound.setAttribute("id", "sound");
        sound.setAttribute("src", sentence);
        sound.setAttribute("preload", "auto");
        document.body.appendChild(sound) //把它添加到頁面上。
        
        target = word[order[i]]; // 目前單字放
        console.log("word:"+target);
        
        word_length = target.length;    // 抓這個字的長度。
        let input_order = getRandomArray(word_length);  // 將letters洗牌。
        letter_position_situation = new Array();// 宣告一維陣列。
        
        for(let j = 0 ; j<word_length ; j++){   //生成答案區和回答區的英文字母。
            $('#input_zone').append("<div id='space_"+j+"' class='space'></div>");
            $('#btn_zone').append("<div id='letter_"+j+"' class='letter'>"+target.charAt(input_order[j])+"</div>");
            
            /*
            宣告二維陣列：
            第0列 放letter、
            第1列 放letter是否仍在回答區，以防相同字母消失。
            */
            
            letter_position_situation[j] = [ target.charAt(input_order[j]) , 1 ];
        }
        
        together();
        
    }
    
    order = getRandomArray(4);    // 順序洗牌。
    console.log("order:"+order);
    
    dialog_message(2);  // 一開始的遊戲介紹。
    change_content();   // 內容物改變。
    playGame(round);    // 重新載入內容物。
    
    console.log("round:"+round);
    
    
});