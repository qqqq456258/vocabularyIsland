$(function () {
    let title = "";             // 標題。
    let topic = 0;              // 將單字主題以數字來辨別，這裡 0 是表示測試系列。
    let total_level = 0;        // 總關卡數。
    let locked_level = 0;       // 未解鎖關卡起始索引（表示學生目前進度是第 0 關）。
    let title_array = [];       // 每個解鎖自主練習的標題。
    let star_array = [];        // 每個解鎖自主練習的星數。
    let code_array = [];        // 每個自主練習的代碼。
    let content = "";           // 生成自主練習所需的字串。

    /*產生標題*/
    var url = location.href;
    var temp = url.split("=");
    var vars = temp[1].split("%");
    for (var i = 0; i < vars.length; i++) {
        vars[i] =  vars[i].replace(/20/, " ");
        title = title + vars[i];
    };
    $('#title').text(title);
    
    
    /* 抓資料並回傳 自主練習的每個標題，總自主練習總數、自主練習進度(星數)、未解鎖關卡起始。 */
    console.log("開始抓取關卡"+title+"資訊、進度...");
    $.ajax({
        type: "get",
        async: false, //async設定true會變成異步請求。
        cache: true,
        url: "php/topic_challenge_pick.php",
        data:{
            title:title
        },
        dataType: "json",
        success: function (json) {
            /* jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行) */
            console.log('Success.');
            total_level = json['amount_practices'];
            title_array = json['title_practices'];
            star_array = json['star_practices'];
            code_array = json['code_practices'];
            
            /* 找未解鎖關卡的開頭。 */
            let num = 0;
            for( let num = 0 ; num < total_level ; num++ ){
                if( star_array[num] == 0 ){
                    num++;
                    locked_level = num;
                    console.log('locked_level_starting_point:'+locked_level);
                    break;
                }else{
                    num++;
                    locked_level = num;
                }
            }
            
            console.log("total_level:"+total_level);
            console.log("locked_level_starting_point:"+locked_level);
            console.log("title_array:"+title_array);
            console.log("star_array:"+star_array);
            console.log("code_array:"+code_array);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("XMLHttpRequest:" + XMLHttpRequest);
            console.log("textStatus:" + textStatus);
            console.log("errorThrown:" + errorThrown);
            console.log('Error.');
        }
    });
    
    /*產生每個自主練習。*/
    for (let i = 0; i < total_level; i++) {
        content = "<div id='level_" + topic + "_" + i + "' class='each_level' data-code='"+code_array[i]+"'><h3 id='title_" + topic + "_" + i + "' class='title_zone'>" + title_array[i] + "</h3><div id='word_" + topic + "_" + i + "' class='word_zone'>進度：</div><div id='star_" + topic + "_" + i + "' class='star_zone'>";

        /*亮星數*/
        for (let t = 0; t < star_array[i]; t++) {
            if(t>0){
                if(t == 3){ // 避免超過三顆星。
                    console.log('超過三顆星，直接跳出。');
                    break;
                }else{
                    content = content + "<img class='star' src='material/star_review.png'>";
                }
            }else{
                content = content + "<img class='star' src='material/star_shine.png'>";
            }
        }
        /*暗星數*/
        for (let f = 0; f < (3 - star_array[i]); f++) {
            if(star_array[i] > 3){
                break;
                console.log('超過三顆星，直接跳出。');
            }else{
                content = content + "<img class='star' src='material/star_dark.png'>";
            }
        }
        /*關卡鎖頭*/
        if (i >= locked_level) {
            content = content + "<img class='level_icon' src='material/lock.png'>";
        }
        content = content + "</div></div>";

        $("#slide_" + Math.floor(i / 6)).append(content);
        console.log(Math.floor(i / 6));
    }
    
    /* css 部分，關卡的顏色以及鎖住未解鎖關卡之 click 功能。*/
    for(let i=0;i<locked_level;i++){
        $("#level_"+topic+"_"+i).css('backgroundColor','rgb(212,238,227)');
        $("#level_"+topic+"_"+i).css('border','8px solid rgb(45,113,84)');
        $("#word_"+topic+"_"+i).css('color','rgb(45,113,84)');
        $("#title_"+topic+"_"+i).css('backgroundColor','rgb(45,113,84)');
        $("#level_"+topic+"_"+i).css('pointerEvents','auto');
    }
    
    /*生成每個關卡的彈出視窗*/
    for(let i=0;i<locked_level;i++){
        $("#level_"+topic+"_"+i).on("click",function(){
            swal.fire({         //sweetAlert2 的功能。
                    icon: "info",
                    title: $("#title_"+topic+"_"+i).text(),
                    text: "We will test a series of memory practices for four new words.",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonColor: 'rgb(136,169,203)',
                    cancelButtonColor: 'rgb(232,174,126)',
                    confirmButtonText:"P l a y",
                    cancelButtonText:"R e c o r d"
                })
                .then((result) => {
                    if(result.value){
                        let temp = $(this).data('code').split("-");
                        window.location.replace('basic_practices.html?theme='+temp[0]+'&title='+temp[1]+'&practice='+temp[2]);
                        /* 進入自主練習。 */
                        console.log("進入自主練習。");
                    }else{
                        /* 觀看上次錯誤紀錄。 */
                        console.log("觀看上次錯誤紀錄。");
                    }
                        
                });
        });
    }    
    
    /*轉頁效果。*/
    var myFullpage = new fullpage('#stages', {
        resize: true,
        slidesNavigation: true,
        slidesNavPosition: "bottom",
        lazyLoading: true,
        css3: true,
        paddingTop: '30px',
        paddingBottom: '50px'
    });
    $(".fullpage-wrapper").css("height", "auto");
    $(".section fp-auto-height").css("height", "350px");
    
    /*回上一頁*/
    $('#earth').on('click',function(){
        location.replace('Animals_island.html');
    });
    
    /*---------------------------------------------------------------------*/
    


    
    
});