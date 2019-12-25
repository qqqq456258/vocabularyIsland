$(function () {
    
    /*生成關卡狀態。*/
    for(let i=1;i<7;i++){
        $("#slide_0").append("<div id='level_1_"+i+"' class='each_level'><h3 id='title_1_"+i+"' class='title_zone'>Pet & Farm Animals - "+i+"</h3><div class='word_zone'>評分：</div><div id='star_1_"+i+"' class='star_zone'><img class='star' src='material/star_shine.png'><img class='star' src='material/star_shine.png'><img class='star' src='material/star_dark.png'></div></div>");
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