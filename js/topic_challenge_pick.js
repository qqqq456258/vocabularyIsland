$(function () {
    let unlocked_level = 1;
    
    function dialog() { // 跳出通知。
        
        swal.fire({         //sweetAlert2 的功能。
                icon: "info",
                title: "Hello",
                text: "Nothings",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            .then((result) => {
                console.log("1226");
            });
    }
    
    /*生成關卡狀態。*/
    for(let i=1;i<7;i++){
        $("#slide_0").append("<div id='level_1_"+i+"' class='each_level'><h3 id='title_1_"+i+"' class='title_zone'>Pet & Farm Animals - "+i+"</h3><div id='word_1_"+i+"' class='word_zone'>評分：</div><div id='star_1_"+i+"' class='star_zone'><img class='star' src='material/star_dark.png'><img class='star' src='material/star_dark.png'><img class='star' src='material/star_dark.png'></div></div>");
    }
    
    /*css*/
    for(let i=1;i<(unlocked_level+1);i++){
        $("#level_1_"+i).css('backgroundColor','rgb(212,238,227)');
        $("#level_1_"+i).css('border','8px solid rgb(45,113,84)');
        $("#word_1_"+i).css('color','rgb(45,113,84)');
        $("#title_1_"+i).css('backgroundColor','rgb(45,113,84)');
        $("#level_1_"+i).children().unbind('click');
        $("#level_1_"+i).on('click',dialog());
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