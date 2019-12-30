$(function () {
    let topic = 0;              // 將單字主題以數字來辨別，這裡 0 是表示測試系列。
    let total_level = 4;        // 總關卡數。
    let locked_level = 2;       // 未解鎖關卡起始索引（表示學生目前進度是第 0 關）。
    var title_array = ["Fruit - 0","Fruit - 1","Pet & Farm Animals - 0","Pet & Farm Animals - 1"];                               // 每個解鎖自主練習的標題。
    var star_array = [3,1,0,0]; // 每個解鎖自主練習的星數。
    let content = "";           // 生成自主練習所需的字串。
    
    /*生成每個自主練習。*/
    for(let i=0;i<total_level;i++){
        
        content = "<div id='level_"+topic+"_"+i+"' class='each_level'><h3 id='title_"+topic+"_"+i+"' class='title_zone'>"+title_array[i]+"</h3><div id='word_"+topic+"_"+i+"' class='word_zone'>評分：</div><div id='star_"+topic+"_"+i+"' class='star_zone'>";
        
        /*亮星數*/
        for(let t=0;t<star_array[i];t++){
            content = content + "<img class='star' src='material/star_shine.png'>";
        }
        /*暗星數*/
        for(let f=0;f<(3-star_array[i]);f++){
            content = content + "<img class='star' src='material/star_dark.png'>";
        }
        /*關卡鎖頭*/
        if(i>=locked_level){
            content = content + "<img class='level_icon' src='material/lock.png'>";
        }
        content = content + "</div></div>";
        
        $("#slide_0").append(content);
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
                        window.location.assign('basic_practices.html');
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
    $("#stages").fullpage({
        resize: true,
        slidesNavigation: true,
        slidesNavPosition: "bottom",
        lazyLoad: true
    });
    $(".fullpage-wrapper,.section.fp-section.active.fp-completely,.fp-tableCell").css("height", "auto");
    $(".section.fp-section.active.fp-completely").css("padding-bottom", "30px");
    $(".section.fp-section.active.fp-completely").css("padding-top", "10px");
    

    
});