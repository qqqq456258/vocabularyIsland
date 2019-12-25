$(function () {
    var level_code = "";
    var level_code = "";
    
    
    $("#stages").fullpage({
        resize: true,
        slidesNavigation: true,
        slidesNavPosition: "bottom",
        lazyLoad: true
    });
    $(".fullpage-wrapper,.section.fp-section.active.fp-completely,.fp-tableCell").css("height", "auto");
    $(".section.fp-section.active.fp-completely").css("padding-bottom", "30px");
    $(".section.fp-section.active.fp-completely").css("padding-top", "10px");

    
    
    $("#slide").append("<div id='level_1_1' class='each_level'>
                        <h3 id="title_1_1" class="title_zone">Pet & Farm Animals - 1</h3>
                        <div class="word_zone">評分：</div>
                        <div id="star_1_1" class="star_zone">
                            <img class="star" src="material/star_shine.png">
                            <img class="star" src="material/star_shine.png">
                            <img class="star" src="material/star_shine.png">
                        </div>
                    </div>
                       ")
    
});