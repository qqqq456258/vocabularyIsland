$(function(){
    
    let words = []; // 存放單字的陣列。
    
    /* 抓取字卡所需資訊。*/
    function get_card(){

            $.ajax({
                type: "POST",
                async: true, //async設定true會變成異步請求。
                cache: true,
                url: "php/bag.php",
                data:{
                    code:0
                },
                dataType: "json",
                success: function (json) {
                    //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                    console.log(json);
                    console.log(json.length+" 筆資料");

                    let context = "";

                    for(let i = 0 ; i<json.length ; i++){
                        /* 字卡資訊的所需變數。 */
                        let get_only = json[i]['picture_filename'].split("_")[2];
                        let word = json[i]['vocabulary'];
                        let bg_color = json[i]['background_color'];
                        let br_color = json[i]['border_color'];
                        let part_speech = json[i]['vl_part_of_speech'];
                        let definition = json[i]['vl_definition'];

                        /* 抓語音所需變數 */
                        words[i] = word;

                        let new_context = "<div id='"+get_only+"' class='card' data-target='"+json[i]['picture_filename'].split("_")[1]+"' style='background-color: "+bg_color+";border: 8px solid "+br_color+"'><p class='vocabulary'>"+word+"</p><span class='part_speech'>"+part_speech+"</span><span class='definition'>"+definition+"</span><br><input type='image' class='normal_sound' data-target='"+json[i]['picture_filename'].split("_")[1]+"' src='material/speaker.png'><input type='image' class='self_sound' data-target='"+get_only+"' src='material/self_speak.png'><img class='picture' src='upload/image/"+json[i]['picture_filename']+".jpeg' alt=''></div>";

                        context = context + new_context;
                        
                        get_self_audio(json[i]['picture_filename']);

                    }

                    /* 渲染於瀏覽器上。 */
                    $('#card_pile').append(context);

                    /* 將陣列中重複的單字剃除。 */
                    let result = {};
                    let repeat = {};
                    words.forEach(function(item){
                        result.hasOwnProperty(item) ? repeat[item] ++ : result[item] ++;
                    });
                    words = Object.keys(result);
                    console.log(words);

                    /* 抓取標準語音。 */
                    for(let i = 0 ; i < words.length ; i++){
                        get_normal_audio(words[i]);
                    }


                },
                error: function (error) {
                    console.log(error.responseText);
                    alert('get_card : Wrong。');

                }
            });
    }
    /* 抓取字卡所需 標準 語音。*/
    function get_normal_audio(word) {

        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/bag.php",
            data: {
                code: 1,
                word: word
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                
                let sound;
                let regex = /\s/;
                
                if(json.length > 0){
                    
                    let vocabulary = json[0].spelling;
                    vocabulary = vocabulary.replace(regex,'');
                    console.log('vocabulary:'+vocabulary);

                    sound = document.createElement("audio");                //創建聲音檔元件。
                    sound.setAttribute("id", "sound_" + vocabulary);        //給予ID。
                    sound.setAttribute("src", json[0].sounds[0].fileName);
                    sound.setAttribute("preload", "auto");
                    document.body.appendChild(sound); //把它添加到頁面上。
                }else{
                    
                    let vocabulary = word;
                    vocabulary = vocabulary.replace(regex,'');
                    console.log('vocabulary:'+vocabulary);

                    sound = document.createElement("audio"); //創建聲音檔元件。
                    sound.setAttribute("id", "sound_" + vocabulary);
                    sound.setAttribute("src", "word_sound/" + vocabulary + ".mp3");
                    sound.setAttribute("preload", "auto");
                    document.body.appendChild(sound);
                }
            },
            error: function (error) {
                console.log(error.responseText);
                let sound;
                let regex = /\s/;

                let vocabulary = word;
                vocabulary = vocabulary.replace(regex, '');
                console.log('vocabulary:' + vocabulary);

                sound = document.createElement("audio"); //創建聲音檔元件。
                sound.setAttribute("id", "sound_" + vocabulary);
                sound.setAttribute("src", "word_sound/" + vocabulary + ".mp3");
                sound.setAttribute("preload", "auto");
                document.body.appendChild(sound);
            }
        });
    }
    /* 抓取字卡所需 自己 發音。*/
    function get_self_audio(file_name) {
        
        let sound;
        sound = document.createElement("audio"); //創建聲音檔元件。
        sound.setAttribute("id", "sound_" + file_name.split("_")[2]); //給予ID。
        sound.setAttribute("src", 'upload/sound/'+file_name+'.wav');
        sound.setAttribute("preload", "auto");
        document.body.appendChild(sound); //把它添加到頁面上。
    }
    
    
    /* 搜尋字卡。 */
    $('#search').msearch('#card_pile .card', 'data-target');
    /* 回去英文單字島。 */
    $('#earth').on('click',function(){
            console.log('將進入 - 英文單字島');
            window.location.assign("world.html");
    });
    /* 點擊標準語音 */
    $(document).on('click','.normal_sound',function(){
        console.log('PLAY...');
        let target = $(this).data('target');
        let regex = /\s/;
        target = target.replace(regex,'');
        target = '#sound_'+target;
        console.log('target:'+target);
        
        var playPromise = $(target).get(0).play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
              $(target).get(0).pause();
            })
            .catch(error => {
                console.log(error);
              // Auto-play was prevented
              // Show paused UI.
            });
          }

        var timeout_0 = setTimeout(function () {
            $(target).get(0).play(); /*播放一次語音*/
        }, 300);
        
        
    });
    /* 點擊自己發音 */
    $(document).on('click','.self_sound',function(){
        console.log('PLAY...');
        
        let target = $(this).data('target');
//        let regex = /\s/;
//        target = target.replace(regex,'');
        target = '#sound_'+target;
        console.log('target:'+target);
        
        var playPromise = $(target).get(0).play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
              $(target).get(0).pause();
            })
            .catch(error => {
                console.log(error);
              // Auto-play was prevented
              // Show paused UI.
            });
          }

        var timeout_0 = setTimeout(function () {
            $(target).get(0).play(); /*播放一次語音*/
        }, 300);
    });
    
    get_card();
    
    
    
});