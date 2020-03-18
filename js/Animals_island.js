$(function () {
    let account = ""; // 輸入的帳號。
    let name = ""; // 使用者姓名。
    let total_building_status = [14, 9, 12, 9]; // 島上每棟建築物全部進度。
    let building_status = [0, 0, 0, 0]; // 島上每棟建築物實際進度。
    var svg = d3.select('svg'); //用 Svg 控制整個頁面。
    var g = d3.select('g'); //將 g element 放入 SVG 中，並包覆著頁面所有的 DOM element，以便控制縮放變化。

    
    
    /*抓每個島嶼的關卡進度。*/
    function getStatus(theme_code,title_code,building_code){
        console.log("開始抓島嶼的關卡進度...");
        /* building_code = 0~3 */
        $.ajax({
            type: "post",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/get_island_information.php",
            data:{
                theme:theme_code,
                title:title_code
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log('Success.');
                console.log(json['percentage']);
                if(json['percentage'] == 100){
                    $('#animal-building-image-'+title_code).attr('src','material/animal-island/building-3-'+building_code+'.png');
                }else if(json['percentage'] > 50 && json['percentage'] < 100){
                    $('#animal-building-image-'+title_code).attr('src','material/animal-island/building-2.png');
                }else if(json['percentage'] > 0 && json['percentage'] <= 50){
                    $('#animal-building-image-'+title_code).attr('src','material/animal-island/building-1.png');
                }else{
                    $('#animal-building-image-'+title_code).attr('src','material/animal-island/building-0.png');
                }
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest.responseText);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
            }
        });
        /* 未完成 */
    }


    /* d3.js 的功能，設定縮放事件的內容*/
    function zoomed() {
        try {
            $('foreignObject').attr('transform', d3.event.transform);
        } catch (e) {
            alert(e);
        }
    }

    
    /* 首先，宣告行為 d3.zoom()，再使用call來呼叫，然後設定zoom的參數，最後執行 zoomed 這個function。*/
    if(document.body.clientWidth != 980 || document.body.clientHeight != 768){
        svg.call(d3.zoom()
            .translateExtent([[0, 0], [980, 768]]) // 設定 縮放的範圍，避免拖曳拉出視窗之外。
            .scaleExtent([1, 8]) // 設定 縮放的倍率範圍。
            .on("zoom", zoomed)); // 執行。
    }
    
    /* 進入關卡 */
    $('#animal-building-title-0,#animal-building-image-0,#animal-building-title-1,#animal-building-image-1').on('click',function(){
        let name = $(this).data('name');
        console.log('將要進入 '+name+' 標題');
        let icon = "";
        let title = "";
        let text = "";
        let console_log = "";
        if (status == 0) {
            icon = "warning";
            title = '將要前往';
            text = '是否進入 " '+name+' " ？';
        }
        
        swal.fire({
                icon: icon,
                title: title,
                text: text,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes !'
            })
            .then((result) => {
                if (result.value) {
                    location.replace("topic_challenge_pick.html?name="+name);
                }
            });
    });

    /* 上一頁 */
    $('#boat').on('click', function () {
        console.log('將回到主畫面。');
        location.replace("world.html");
    });



    /*---------------------------------------------------------------------*/


    getStatus(0,0,2);
    getStatus(0,1,1);


});